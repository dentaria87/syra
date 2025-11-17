import { supabase } from '../lib/supabase';
import { LibraryDocument, DocumentCategory, ContractSubCategory } from '../types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPE = 'application/pdf';
const STORAGE_BUCKET = 'library-documents';

export async function getAllDocuments(category?: DocumentCategory): Promise<LibraryDocument[]> {
  let query = supabase
    .from('library_documents')
    .select('*')
    .order('uploaded_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Erreur lors du chargement des documents: ${error.message}`);
  }

  return data || [];
}

export async function searchDocuments(searchTerm: string, category?: DocumentCategory): Promise<LibraryDocument[]> {
  let query = supabase
    .from('library_documents')
    .select('*')
    .ilike('title', `%${searchTerm}%`)
    .order('uploaded_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Erreur lors de la recherche de documents: ${error.message}`);
  }

  return data || [];
}

export async function uploadDocument(
  file: File,
  title: string,
  category: DocumentCategory,
  userId: string,
  organizationId: string,
  subCategory?: ContractSubCategory
): Promise<LibraryDocument> {
  // Validation
  if (title.length < 3) {
    throw new Error('Le titre doit contenir au moins 3 caractères');
  }

  if (file.type !== ALLOWED_FILE_TYPE) {
    throw new Error('Seuls les fichiers PDF sont autorisés');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('La taille du fichier ne doit pas dépasser 10 MB');
  }

  // Generate unique file path
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${organizationId}/${category}/${fileName}`;

  // Upload to Storage
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Erreur lors du téléchargement du fichier: ${uploadError.message}`);
  }

  // Insert into database
  const { data, error: dbError } = await supabase
    .from('library_documents')
    .insert({
      organization_id: organizationId,
      title,
      file_url: filePath,
      file_name: file.name,
      file_size: file.size,
      category,
      sub_category: subCategory,
      uploaded_by: userId,
    })
    .select()
    .single();

  if (dbError) {
    // Rollback: delete uploaded file
    await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
    throw new Error(`Erreur lors de l'enregistrement du document: ${dbError.message}`);
  }

  return data;
}

export async function deleteDocument(documentId: string, fileUrl: string): Promise<void> {
  // Delete from database first
  const { error: dbError } = await supabase
    .from('library_documents')
    .delete()
    .eq('id', documentId);

  if (dbError) {
    throw new Error(`Erreur lors de la suppression du document: ${dbError.message}`);
  }

  // Then delete from Storage
  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([fileUrl]);

  if (storageError) {
    console.error('Erreur lors de la suppression du fichier du storage:', storageError);
  }
}

export async function getDocumentDownloadUrl(fileUrl: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(fileUrl, 3600); // 1 hour expiration

  if (error) {
    throw new Error(`Erreur lors de la génération de l'URL de téléchargement: ${error.message}`);
  }

  if (!data?.signedUrl) {
    throw new Error('URL de téléchargement non disponible');
  }

  return data.signedUrl;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
