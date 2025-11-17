import { useState, useEffect } from 'react';
import { Bell, Search, FileText, Eye, Download, Trash2, Plus, FolderOpen } from 'lucide-react';
import { LibraryDocument, DocumentCategory, UploadCategory, ContractSubCategory, LibraryMainCategory, MockLibraryDocument } from '../types';
import { getAllDocuments, searchDocuments, deleteDocument, getDocumentDownloadUrl, formatFileSize } from '../services/libraryService';
import { getActiveProfile, getProfilePermissions } from '../services/profileService';
import UploadDocumentModal from './UploadDocumentModal';
import { mockLibraryDocuments } from '../data/mockLibraryDocuments';

interface BibliothequeProps {
  onNotificationClick: () => void;
  notificationCount: number;
  initialCategory?: LibraryMainCategory;
}

export default function Bibliotheque({ onNotificationClick, notificationCount, initialCategory }: BibliothequeProps) {
  const [mainCategory, setMainCategory] = useState<LibraryMainCategory>(initialCategory || 'Contrats');
  const [activeSubTab, setActiveSubTab] = useState<ContractSubCategory>('PER');
  const [documents, setDocuments] = useState<LibraryDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<(LibraryDocument | MockLibraryDocument)[]>([]);
  const [allDocuments, setAllDocuments] = useState<LibraryDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [canUpload, setCanUpload] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState<UploadCategory>('Contrats');
  const [uploadSubCategory, setUploadSubCategory] = useState<ContractSubCategory>('PER');

  useEffect(() => {
    checkPermissionsAndLoad();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category') as LibraryMainCategory;
    if (categoryParam && (categoryParam === 'Contrats' || categoryParam === 'Bienviyance')) {
      setMainCategory(categoryParam);
      setUploadCategory(categoryParam);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [mainCategory, activeSubTab]);

  useEffect(() => {
    let docsToFilter: (LibraryDocument | MockLibraryDocument)[] = [];

    if (mainCategory === 'Contrats') {
      const realDocs = documents.filter(d => d.category === 'Contrats' && d.sub_category === activeSubTab);
      const mockDocs = mockLibraryDocuments.filter(d => d.category === 'Contrats' && d.sub_category === activeSubTab);
      docsToFilter = [...realDocs, ...mockDocs];
    } else {
      const realDocs = documents.filter(d => d.category === 'Bienviyance');
      const mockDocs = mockLibraryDocuments.filter(d => d.category === 'Bienviyance');
      docsToFilter = [...realDocs, ...mockDocs];
    }

    if (searchTerm.trim()) {
      const filtered = docsToFilter.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocuments(filtered);
    } else {
      setFilteredDocuments(docsToFilter);
    }
  }, [searchTerm, documents, mainCategory, activeSubTab]);

  const checkPermissionsAndLoad = async () => {
    try {
      const profile = await getActiveProfile();
      if (profile) {
        setCurrentUserId(profile.id);
        const permissions = getProfilePermissions(profile.profile_type);
        setCanUpload(permissions.canUploadLibraryDocuments);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const allDocs = await getAllDocuments();
      setAllDocuments(allDocs);
      setDocuments(allDocs);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: LibraryDocument) => {
    try {
      const url = await getDocumentDownloadUrl(doc.file_url);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du document');
    }
  };

  const handleView = async (doc: LibraryDocument) => {
    try {
      const url = await getDocumentDownloadUrl(doc.file_url);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Erreur lors de l\'ouverture:', error);
      alert('Erreur lors de l\'ouverture du document');
    }
  };

  const handleDelete = async (doc: LibraryDocument) => {
    if (showDeleteConfirm !== doc.id) {
      setShowDeleteConfirm(doc.id);
      return;
    }

    try {
      await deleteDocument(doc.id, doc.file_url);
      await loadDocuments();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du document');
    }
  };

  const handleUploadSuccess = () => {
    loadDocuments();
    setShowUploadModal(false);
  };

  const allContratsCount = [...allDocuments.filter(d => d.category === 'Contrats'), ...mockLibraryDocuments.filter(d => d.category === 'Contrats')].length;
  const allBienviyanceCount = [...allDocuments.filter(d => d.category === 'Bienviyance'), ...mockLibraryDocuments.filter(d => d.category === 'Bienviyance')].length;

  const perCount = [...allDocuments.filter(d => d.sub_category === 'PER'), ...mockLibraryDocuments.filter(d => d.sub_category === 'PER')].length;
  const avCount = [...allDocuments.filter(d => d.sub_category === 'Assurance Vie'), ...mockLibraryDocuments.filter(d => d.sub_category === 'Assurance Vie')].length;
  const prevoyanceCount = [...allDocuments.filter(d => d.sub_category === 'Prévoyance'), ...mockLibraryDocuments.filter(d => d.sub_category === 'Prévoyance')].length;

  const isMockDocument = (doc: LibraryDocument | MockLibraryDocument): doc is MockLibraryDocument => {
    return 'id' in doc && doc.id.startsWith('mock-');
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">
            Bibliothèque - {mainCategory}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">
            {mainCategory === 'Contrats' ? 'Documents contractuels et produits' : 'Documents internes Bienviyance'}
          </p>
        </div>
        <button
          onClick={onNotificationClick}
          className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm relative flex-shrink-0"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-light shadow-lg animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>
      </header>

      <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-5 max-w-[1800px] mx-auto">
        <div className="glass-card p-6 floating-shadow">
          {mainCategory === 'Contrats' && (
            <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
              <button
                onClick={() => setActiveSubTab('PER')}
                className={`px-4 py-2 rounded-full text-sm font-light transition-all ${
                  activeSubTab === 'PER'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                PER ({perCount})
              </button>
              <button
                onClick={() => setActiveSubTab('Assurance Vie')}
                className={`px-4 py-2 rounded-full text-sm font-light transition-all ${
                  activeSubTab === 'Assurance Vie'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Assurance Vie ({avCount})
              </button>
              <button
                onClick={() => setActiveSubTab('Prévoyance')}
                className={`px-4 py-2 rounded-full text-sm font-light transition-all ${
                  activeSubTab === 'Prévoyance'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Prévoyance ({prevoyanceCount})
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un document..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {canUpload ? (
                <div className="flex items-center gap-2">
                  {mainCategory === 'Contrats' && (
                    <select
                      value={uploadSubCategory}
                      onChange={(e) => setUploadSubCategory(e.target.value as ContractSubCategory)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-full text-sm font-light focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    >
                      <option value="PER">PER</option>
                      <option value="Assurance Vie">Assurance Vie</option>
                      <option value="Prévoyance">Prévoyance</option>
                    </select>
                  )}
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Ajouter un document</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-500 font-light">
                  <span>Droits insuffisants pour ajouter des documents</span>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card p-4 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FolderOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-light text-gray-900 mb-2">Aucun document disponible</h3>
              <p className="text-sm text-gray-500 font-light mb-6">
                {searchTerm ? 'Aucun résultat pour votre recherche' : 'Commencez par ajouter un document'}
              </p>
              {canUpload && !searchTerm && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105"
                >
                  Ajouter un document
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="glass-card glass-card-hover p-4 floating-shadow relative group"
                >
                  {showDeleteConfirm === doc.id && (
                    <div className="absolute inset-0 bg-red-50/95 backdrop-blur-sm rounded-3xl z-10 flex flex-col items-center justify-center p-4">
                      <p className="text-sm text-gray-900 font-medium mb-3 text-center">
                        Confirmer la suppression ?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-xs font-light hover:bg-gray-50"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs font-light hover:from-red-600 hover:to-red-700"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg mb-3">
                    <FileText className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                    {doc.title}
                  </h3>

                  <div className="text-xs text-gray-500 font-light space-y-1 mb-3">
                    <p>{new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}</p>
                    <p>{formatFileSize(doc.file_size)}</p>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleView(doc)}
                      className="flex-1 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir"
                    >
                      <Eye className="w-4 h-4 text-blue-600 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex-1 p-2 hover:bg-green-50 rounded-lg transition-colors"
                      title="Télécharger"
                    >
                      <Download className="w-4 h-4 text-green-600 mx-auto" />
                    </button>
                    {canUpload && !isMockDocument(doc) && (
                      <button
                        onClick={() => handleDelete(doc)}
                        className="flex-1 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 mx-auto" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showUploadModal && currentUserId && (
        <UploadDocumentModal
          userId={currentUserId}
          organizationId="1"
          uploadCategory={uploadCategory}
          uploadSubCategory={mainCategory === 'Contrats' ? uploadSubCategory : undefined}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
