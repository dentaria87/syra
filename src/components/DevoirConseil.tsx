import { useState, useEffect } from 'react';
import { Bell, FileText, Download, Save, Plus, Trash2, Search, Eye, ArrowLeft, Mail, Filter, X, Pencil } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PDFViewerModal from './PDFViewerModal';
import NewDevoirConseil from './NewDevoirConseil';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PageHeaderProps {
  onNotificationClick: () => void;
  notificationCount: number;
}

interface ConseilData {
  id?: string;
  client_name: string;
  besoins: string;
  risques: string;
  budget: string;
  situation_familiale: string;
  situation_professionnelle: string;
  projets: string;
  autres_remarques: string;
  produits_proposes: string;
  garanties: string;
  exclusions: string;
  limites: string;
  conditions: string;
  contrat_choisi: string;
  options: string;
  montants_garantie: string;
  adequation_confirmee: boolean;
  risques_refus: string;
  signature_client: string;
  date_signature: string;
  created_at?: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

export default function DevoirConseil({ onNotificationClick, notificationCount }: PageHeaderProps) {
  const [conseils, setConseils] = useState<ConseilData[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingConseil, setEditingConseil] = useState<ConseilData | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLeadSuggestions, setShowLeadSuggestions] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewingConseil, setViewingConseil] = useState<ConseilData | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showNewDevoirForm, setShowNewDevoirForm] = useState(false);
  const [filterClientName, setFilterClientName] = useState('');
  const [filterContrat, setFilterContrat] = useState('');
  const [filterDateDebut, setFilterDateDebut] = useState('');
  const [filterDateFin, setFilterDateFin] = useState('');
  const [filterBudgetMin, setFilterBudgetMin] = useState('');
  const [filterBudgetMax, setFilterBudgetMax] = useState('');
  const [listSearchTerm, setListSearchTerm] = useState('');
  const [formData, setFormData] = useState<ConseilData>({
    client_name: '',
    besoins: '',
    risques: '',
    budget: '',
    situation_familiale: '',
    situation_professionnelle: '',
    projets: '',
    autres_remarques: '',
    produits_proposes: '',
    garanties: '',
    exclusions: '',
    limites: '',
    conditions: '',
    contrat_choisi: '',
    options: '',
    montants_garantie: '',
    adequation_confirmee: false,
    risques_refus: '',
    signature_client: '',
    date_signature: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadConseils();
    loadLeads();
  }, []);


  const loadConseils = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const mockConseils: ConseilData[] = [
        {
          id: '0',
          client_name: 'Serge Del Vall',
          civilite: 'M.',
          nom: 'Del Vall',
          prenom: 'Serge',
          telephone: '0620847919',
          email: 'delvallepaton.sergie@gmail.com',
          site_internet: '',
          actif: true,
          adresse: '1 IMP JACOB INSEL',
          ville: 'TOULOUSE',
          code_postal: '31200',
          date_naissance: '1985-01-01',
          statut_professionnel: 'TNS',
          profession: 'Consultant',
          caisse_professionnelle: 'RSI',
          remuneration: '34235',
          dividende: '0',
          credit_en_cours: '0',
          autres_revenus: '0',
          commentaire: 'Client régulier depuis 2020',
          besoins: 'Protection santé complète pour la famille',
          risques: 'Risques médicaux liés à des antécédents familiaux',
          budget: '250€/mois',
          situation_familiale: 'Marié, 2 enfants',
          situation_professionnelle: 'Consultant indépendant dans le secteur IT',
          projets: 'Achat résidence secondaire dans 2 ans',
          autres_remarques: 'Souhaite une franchise faible',
          produits_proposes: 'Assurance Santé Premium, Assurance Santé Famille Plus',
          garanties: 'Hospitalisation 100%, Soins dentaires 200%, Optique 300€/an',
          exclusions: 'Cures thermales non remboursées',
          limites: 'Plafond annuel: 50000€',
          conditions: 'Franchise annuelle: 50€',
          contrat_choisi: 'Assurance Santé Famille Plus - Formule Or',
          options: 'Option Assistance 24/7',
          montants_garantie: 'Hospitalisation: illimité, Dentaire: 1500€/an',
          adequation_confirmee: true,
          risques_refus: 'Sans cette couverture, les frais d\'hospitalisation pourraient atteindre plusieurs milliers d\'euros',
          signature_client: 'Serge Del Vall',
          date_signature: '2025-11-01',
          created_at: '2025-11-06T09:00:00.000000Z'
        },
        {
          id: '1',
          client_name: 'Sophie Martin',
          civilite: 'Mme',
          nom: 'Martin',
          prenom: 'Sophie',
          telephone: '0612345678',
          email: 'sophie.martin@outlook.fr',
          site_internet: '',
          actif: true,
          adresse: '45 Avenue de la République',
          ville: 'PARIS',
          code_postal: '75011',
          date_naissance: '1982-05-20',
          statut_professionnel: 'Salarié',
          profession: 'Cadre supérieur',
          caisse_professionnelle: 'Régime général',
          remuneration: '65000',
          dividende: '0',
          credit_en_cours: '250000',
          autres_revenus: '0',
          commentaire: 'Cliente fidèle, très satisfaite du service',
          besoins: 'Protection santé complète pour la famille',
          risques: 'Risques médicaux liés à des antécédents familiaux',
          budget: '250€/mois',
          situation_familiale: 'Mariée, 2 enfants',
          situation_professionnelle: 'Cadre supérieur dans le secteur bancaire',
          projets: 'Achat résidence secondaire dans 2 ans',
          autres_remarques: 'Souhaite une franchise faible',
          produits_proposes: 'Assurance Santé Premium, Assurance Santé Famille Plus',
          garanties: 'Hospitalisation 100%, Soins dentaires 200%, Optique 300€/an',
          exclusions: 'Cures thermales non remboursées',
          limites: 'Plafond annuel: 50000€',
          conditions: 'Franchise annuelle: 50€',
          contrat_choisi: 'Assurance Santé Famille Plus - Formule Or',
          options: 'Option Assistance 24/7',
          montants_garantie: 'Hospitalisation: illimité, Dentaire: 1500€/an',
          adequation_confirmee: true,
          risques_refus: 'Sans cette couverture, les frais d\'hospitalisation pourraient atteindre plusieurs milliers d\'euros',
          signature_client: 'Sophie Martin',
          date_signature: '2025-09-15',
          created_at: '2025-10-05T09:36:50.373984Z'
        },
        {
          id: '2',
          client_name: 'Thomas Dubois',
          civilite: 'M.',
          nom: 'Dubois',
          prenom: 'Thomas',
          telephone: '0698765432',
          email: 'thomas.dubois@gmail.com',
          site_internet: 'www.thomasdubois-digital.fr',
          actif: true,
          adresse: '12 Rue des Entrepreneurs',
          ville: 'LYON',
          code_postal: '69002',
          date_naissance: '1990-08-15',
          statut_professionnel: 'TNS',
          profession: 'Entrepreneur digital',
          caisse_professionnelle: 'RSI',
          remuneration: '42000',
          dividende: '8000',
          credit_en_cours: '0',
          autres_revenus: '5000',
          commentaire: 'Jeune entrepreneur dynamique avec fort potentiel',
          besoins: 'Assurance habitation pour appartement de 85m²',
          risques: 'Appartement au 4ème étage, zone à risque cambriolage modéré',
          budget: '35€/mois',
          situation_familiale: 'Célibataire',
          situation_professionnelle: 'Entrepreneur dans le digital',
          projets: 'Expansion de son activité professionnelle',
          autres_remarques: 'Matériel informatique de valeur au domicile (15000€)',
          produits_proposes: 'Habitation Confort, Habitation Premium',
          garanties: 'Responsabilité civile, Vol et vandalisme, Dégâts des eaux',
          exclusions: 'Catastrophes naturelles non déclarées',
          limites: 'Franchise 150€ par sinistre',
          conditions: 'Délai de déclaration sinistre: 5 jours ouvrés',
          contrat_choisi: 'Habitation Premium avec option Matériel Professionnel',
          options: 'Extension garantie matériel informatique professionnel',
          montants_garantie: 'Capital mobilier: 30000€, Matériel pro: 15000€',
          adequation_confirmee: true,
          risques_refus: 'Sans assurance habitation, tout sinistre serait à sa charge complète',
          signature_client: 'Thomas Dubois',
          date_signature: '2025-09-20',
          created_at: '2025-10-05T09:36:50.373984Z'
        },
        {
          id: '3',
          client_name: 'Marie Lefebvre',
          civilite: 'Mme',
          nom: 'Lefebvre',
          prenom: 'Marie',
          telephone: '0623456789',
          email: 'marie.lefebvre@avocat-conseil.fr',
          site_internet: '',
          actif: true,
          adresse: '78 Boulevard Haussmann',
          ville: 'PARIS',
          code_postal: '75008',
          date_naissance: '1985-03-12',
          statut_professionnel: 'Profession libérale',
          profession: 'Avocate',
          caisse_professionnelle: 'CARPIMKO',
          remuneration: '85000',
          dividende: '0',
          credit_en_cours: '320000',
          autres_revenus: '12000',
          commentaire: 'Cliente exigeante, apprécie la réactivité et la qualité du service',
          besoins: 'Assurance auto pour véhicule neuf, tous risques',
          risques: 'Véhicule haut de gamme nécessitant une protection complète',
          budget: '85€/mois',
          situation_familiale: 'Mariée, 1 enfant',
          situation_professionnelle: 'Avocate',
          projets: 'Changement de véhicule tous les 3 ans via leasing',
          autres_remarques: 'Véhicule utilisé quotidiennement (20000 km/an)',
          produits_proposes: 'Auto Tous Risques Premium, Auto Sérénité Plus',
          garanties: 'Tous risques collision, Vol incendie, Bris de glace',
          exclusions: 'Conduite hors permis valide, Usage compétition',
          limites: 'Franchise 0€ si garage agréé',
          conditions: 'Assistance 0km, Véhicule de remplacement',
          contrat_choisi: 'Auto Tous Risques Premium - Valeur à Neuf 24 mois',
          options: 'Extension Garantie Conducteur à 1000000€',
          montants_garantie: 'Dommages tous accidents: valeur véhicule',
          adequation_confirmee: true,
          risques_refus: 'Sans garantie tous risques, tout accident responsable serait à charge',
          signature_client: 'Marie Lefebvre',
          date_signature: '2025-09-28',
          created_at: '2025-10-05T09:36:50.373984Z'
        }
      ];
      setConseils(mockConseils);
      return;
    }

    const { data, error } = await supabase
      .from('devoirs_conseil')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading conseils:', error);
    } else if (data) {
      console.log('Loaded conseils:', data);
      setConseils(data);
    }
  };

  const loadLeads = async () => {
    const mockLeads: Lead[] = [
      {
        id: '4',
        name: 'Emilie LECOURT',
        email: 'elecourt@laposte.net',
        phone: '0673183510',
        status: 'RDV pris'
      },
      {
        id: '6',
        name: 'Thomas BERNARD',
        email: 'thomas.bernard@gmail.com',
        phone: '0698765432',
        status: 'NRP'
      },
      {
        id: '5',
        name: 'Sophie MARTIN',
        email: 'sophie.martin@outlook.fr',
        phone: '0612345678',
        status: 'Signé'
      },
      {
        id: '1',
        name: 'Madame DAHCHAR',
        email: 'dahchar@icloud.com',
        phone: '0781170861',
        status: 'NRP'
      },
      {
        id: '7',
        name: 'Julie DUBOIS',
        email: 'julie.dubois@yahoo.fr',
        phone: '0623456789',
        status: 'À rappeler'
      }
    ];
    setLeads(mockLeads);
  };

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setSearchTerm(lead.name);
    setShowLeadSuggestions(false);
    setFormData({
      ...formData,
      client_name: lead.name,
      signature_client: lead.name
    });
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConseils = conseils.filter(conseil => {
    const matchesSearch = listSearchTerm === '' ||
      conseil.client_name.toLowerCase().includes(listSearchTerm.toLowerCase()) ||
      conseil.contrat_choisi.toLowerCase().includes(listSearchTerm.toLowerCase());

    const matchesClientName = filterClientName === '' ||
      conseil.client_name.toLowerCase().includes(filterClientName.toLowerCase());

    const matchesContrat = filterContrat === '' ||
      conseil.contrat_choisi.toLowerCase().includes(filterContrat.toLowerCase());

    const matchesDateDebut = filterDateDebut === '' ||
      new Date(conseil.date_signature) >= new Date(filterDateDebut);

    const matchesDateFin = filterDateFin === '' ||
      new Date(conseil.date_signature) <= new Date(filterDateFin);

    const conseilBudget = parseFloat(conseil.budget.replace(/[^0-9.]/g, '')) || 0;
    const matchesBudgetMin = filterBudgetMin === '' ||
      conseilBudget >= parseFloat(filterBudgetMin);

    const matchesBudgetMax = filterBudgetMax === '' ||
      conseilBudget <= parseFloat(filterBudgetMax);

    return matchesSearch && matchesClientName && matchesContrat &&
           matchesDateDebut && matchesDateFin && matchesBudgetMin && matchesBudgetMax;
  });

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    let error;
    if (editingConseil && editingConseil.id) {
      const { error: updateError } = await supabase
        .from('devoirs_conseil')
        .update(formData)
        .eq('id', editingConseil.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('devoirs_conseil')
        .insert([{ ...formData, user_id: user.id }]);
      error = insertError;
    }

    if (!error) {
      loadConseils();
      setIsCreating(false);
      setEditingConseil(null);
      resetForm();
    }
  };

  const handleGeneratePDF = async (conseil: ConseilData) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '800px';
    tempDiv.style.padding = '40px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.innerHTML = generatePDFContent(conseil);
    document.body.appendChild(tempDiv);

    try {
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`devoir-conseil-${conseil.client_name}-${new Date().toISOString().split('T')[0]}.pdf`);
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  const generatePDFContent = (conseil: ConseilData) => {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto;">
          <h1 style="color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px;">DOCUMENT DE DEVOIR DE CONSEIL</h1>
          <p><strong>Client :</strong> ${conseil.client_name}</p>
          <p><strong>Date :</strong> ${conseil.date_signature}</p>

          <h2 style="color: #1e40af; margin-top: 30px; border-left: 4px solid #2563eb; padding-left: 10px;">1. Analyse de la situation du client</h2>
          <div style="margin-bottom: 25px; padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="font-weight: bold; color: #374151; margin-top: 10px;">Besoins :</div>
            <div style="margin-left: 10px; color: #1f2937;">${conseil.besoins}</div>

            <div style="font-weight: bold; color: #374151; margin-top: 10px;">Risques identifiés :</div>
            <div style="margin-left: 10px; color: #1f2937;">${conseil.risques}</div>

            <div style="font-weight: bold; color: #374151; margin-top: 10px;">Budget :</div>
            <div style="margin-left: 10px; color: #1f2937;">${conseil.budget}</div>

            <div style="font-weight: bold; color: #374151; margin-top: 10px;">Situation familiale :</div>
            <div style="margin-left: 10px; color: #1f2937;">${conseil.situation_familiale}</div>

            <div style="font-weight: bold; color: #374151; margin-top: 10px;">Situation professionnelle :</div>
            <div style="margin-left: 10px; color: #1f2937;">${conseil.situation_professionnelle}</div>

            <div style="font-weight: bold; color: #374151; margin-top: 10px;">Projets :</div>
            <div style="margin-left: 10px; color: #1f2937;">${conseil.projets}</div>

            <div style="font-weight: bold; color: #374151; margin-top: 10px;">Autres remarques :</div>
            <div style="margin-left: 10px; color: #1f2937;">${conseil.autres_remarques}</div>
          </div>

          <h2 style="color: #1e40af; margin-top: 30px; border-left: 4px solid #2563eb; padding-left: 10px;">2. Informations sur les contrats proposés</h2>
          <div style="margin-bottom: 25px; padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="font-weight: bold; color: #374151; margin-top: 10px;">Produits proposés :</div>
            <div style="margin-left: 10px; color: #1f2937;">${conseil.produits_proposes}</div>

            <div style="font-weight: bold; color: #374151; margin-top: 10px;">Garanties :</div>
            <div style="margin-left: 10px; color: #1f2937;">${conseil.garanties}</div>

            <div style="font-weight: bold; color: #374151; margin-top: 10px;">Exclusions :</div>
            <div style="margin-left: 10px; color: #1f2937;">${conseil.exclusions}</div>

            <div style="font-weight: bold; color: #374151; margin-top: 10px;">Limites :</div>
            <div style="margin-left: 10px; color: #1f2937;">${conseil.limites}</div>

            <div style="font-weight: bold; color: #374151; margin-top: 10px;">Conditions :</div>
            <div style="margin-left: 10px; color: #1f2937;">${conseil.conditions}</div>
          </div>

          <h2 style="color: #1e40af; margin-top: 30px; border-left: 4px solid #2563eb; padding-left: 10px;">3. Recommandation d'une solution adaptée</h2>
          <div style="margin-bottom: 25px; padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="font-weight: bold; color: #374151; margin-top: 10px;">Contrat choisi :</div>
            <div style="margin-left: 10px; color: #1f2937;">${conseil.contrat_choisi}</div>

            <div style="font-weight: bold; color: #374151; margin-top: 10px;">Options :</div>
            <div style="margin-left: 10px; color: #1f2937;">${conseil.options}</div>

            <div style="font-weight: bold; color: #374151; margin-top: 10px;">Montants de garantie :</div>
            <div style="margin-left: 10px; color: #1f2937;">${conseil.montants_garantie}</div>
          </div>

          <h2 style="color: #1e40af; margin-top: 30px; border-left: 4px solid #2563eb; padding-left: 10px;">4. Vérification de l'adéquation</h2>
          <div style="margin-bottom: 25px; padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="margin-left: 10px; color: #1f2937;">
              ${conseil.adequation_confirmee ? '✓ Le contrat correspond aux besoins exprimés par le client' : '✗ Le contrat ne correspond pas aux besoins'}
            </div>
          </div>

          <h2 style="color: #1e40af; margin-top: 30px; border-left: 4px solid #2563eb; padding-left: 10px;">5. Risques en cas de refus de garanties</h2>
          <div style="margin-bottom: 25px; padding: 15px; background: #f9fafb; border-radius: 8px;">
            <div style="margin-left: 10px; color: #1f2937;">${conseil.risques_refus}</div>
          </div>

          <div style="border: 2px solid #2563eb; padding: 20px; margin-top: 30px; background: #eff6ff;">
            <h2 style="color: #1e40af;">Validation et signature</h2>
            <p><strong>Signature du client :</strong> ${conseil.signature_client}</p>
            <p><strong>Date :</strong> ${conseil.date_signature}</p>
            <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
              Je soussigné(e) ${conseil.signature_client}, reconnais avoir été informé(e) de manière claire et complète
              sur les garanties proposées, leurs limites et exclusions, ainsi que sur les risques encourus en cas de refus
              de certaines garanties. Ce document respecte les obligations du devoir de conseil conformément à la DDA.
            </p>
          </div>

          <div style="margin-top: 50px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>Document généré par SYRA.io - Conforme à la Directive Distribution Assurance (DDA)</p>
            <p>Date de génération : ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
    `;
  };

  const resetForm = () => {
    setFormData({
      client_name: '',
      besoins: '',
      risques: '',
      budget: '',
      situation_familiale: '',
      situation_professionnelle: '',
      projets: '',
      autres_remarques: '',
      produits_proposes: '',
      garanties: '',
      exclusions: '',
      limites: '',
      conditions: '',
      contrat_choisi: '',
      options: '',
      montants_garantie: '',
      adequation_confirmee: false,
      risques_refus: '',
      signature_client: '',
      date_signature: new Date().toISOString().split('T')[0]
    });
    setSearchTerm('');
    setSelectedLead(null);
    setShowLeadSuggestions(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('devoirs_conseil')
      .delete()
      .eq('id', id);

    if (!error) {
      loadConseils();
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Devoir de conseil</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Gestion des documents d'adéquation DDA</p>
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
        {!isCreating && !showNewDevoirForm && (
          <>
            <div className="mb-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowNewDevoirForm(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all flex items-center gap-2 justify-center"
              >
                <Plus className="w-4 h-4" />
                Nouveau devoir de conseil
              </button>

              <div className="flex gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou contrat..."
                    value={listSearchTerm}
                    onChange={(e) => setListSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-light text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <Filter className="w-4 h-4 text-gray-900 dark:text-gray-300" />
                  Filtres
                  {(filterClientName || filterContrat || filterDateDebut || filterDateFin || filterBudgetMin || filterBudgetMax) && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </button>
              </div>
            </div>

            {showFilters && (
              <>
                <div className="fixed inset-0 z-[9998]" onClick={() => setShowFilters(false)} />
                <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
                  <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-[600px]">
                    <div className="p-6 border-b border-gray-200/30 flex items-center justify-between">
                      <h2 className="text-xl font-light text-gray-900">Filtres</h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <label className="text-sm font-light text-gray-700">Nom du client</label>
                        </div>
                        <input
                          type="text"
                          placeholder="Filtrer par nom..."
                          value={filterClientName}
                          onChange={(e) => setFilterClientName(e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <label className="text-sm font-light text-gray-700">Contrat choisi</label>
                        </div>
                        <input
                          type="text"
                          placeholder="Filtrer par contrat..."
                          value={filterContrat}
                          onChange={(e) => setFilterContrat(e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <label className="text-sm font-light text-gray-700">Période de signature</label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="date"
                            placeholder="Date début"
                            value={filterDateDebut}
                            onChange={(e) => setFilterDateDebut(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                          />
                          <input
                            type="date"
                            placeholder="Date fin"
                            value={filterDateFin}
                            onChange={(e) => setFilterDateFin(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <label className="text-sm font-light text-gray-700">Budget (€/mois)</label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="number"
                            placeholder="Budget Min."
                            value={filterBudgetMin}
                            onChange={(e) => setFilterBudgetMin(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                          />
                          <input
                            type="number"
                            placeholder="Budget Max."
                            value={filterBudgetMax}
                            onChange={(e) => setFilterBudgetMax(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-t border-gray-200/30 flex gap-3">
                      <button
                        onClick={() => {
                          setFilterClientName('');
                          setFilterContrat('');
                          setFilterDateDebut('');
                          setFilterDateFin('');
                          setFilterBudgetMin('');
                          setFilterBudgetMax('');
                        }}
                        className="flex-1 px-6 py-2.5 bg-white/80 border border-gray-200 text-gray-700 rounded-full text-sm font-light hover:bg-white transition-all"
                      >
                        Réinitialiser
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
                      >
                        Appliquer
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className={`space-y-4 transition-all duration-300 ${showFilters ? 'blur-sm' : ''}`}>
              {filteredConseils.map((conseil) => (
              <div key={conseil.id} className="glass-card glass-card-hover floating-shadow cursor-pointer" onClick={() => setViewingConseil(conseil)}>
                <div className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-light shadow-lg flex-shrink-0">
                        {conseil.client_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-light text-gray-900 text-base md:text-lg">{conseil.client_name}</h3>
                        <p className="text-xs text-gray-500 font-light mt-1">
                          Créé le {new Date(conseil.created_at!).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingConseil(conseil);
                          setShowNewDevoirForm(true);
                        }}
                        className="w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingConseil(conseil);
                        }}
                        className="w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                        title="Consulter"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Renvoyer le devoir de conseil:', conseil.id);
                        }}
                        className="w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                        title="Renvoyer par email"
                      >
                        <Mail className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGeneratePDF(conseil);
                        }}
                        className="w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                        title="Télécharger PDF"
                      >
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(conseil.id!);
                        }}
                        className="w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                  <div>
                    <span className="text-gray-500 font-light">Contrat choisi:</span>
                    <p className="text-gray-800">{conseil.contrat_choisi}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-light">Date signature:</span>
                    <p className="text-gray-800">{conseil.date_signature}</p>
                  </div>
                </div>
                </div>
              </div>
            ))}

            {filteredConseils.length === 0 && (
              <div className="glass-card p-16 text-center floating-shadow">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-light">
                  {conseils.length === 0 ? 'Aucun devoir de conseil créé' : 'Aucun résultat ne correspond à vos critères'}
                </p>
              </div>
            )}
          </div>
          </>
        )}

        {isCreating && !showNewDevoirForm && (
          <>
            <div className="mb-4">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingConseil(null);
                  resetForm();
                }}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-light hover:bg-gray-50 shadow-sm transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
            </div>
            <div className="bg-white backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200 p-8 max-w-5xl mx-auto">
              <h2 className="text-2xl font-light text-gray-800 mb-8">
                {editingConseil ? 'Modifier le devoir de conseil' : 'Nouveau devoir de conseil'}
              </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">1</span>
                  Informations client
                </h3>
                <div className="grid grid-cols-1 gap-4 ml-10">
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher un lead..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setShowLeadSuggestions(true);
                        }}
                        onFocus={() => setShowLeadSuggestions(true)}
                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                      />
                    </div>
                    {showLeadSuggestions && filteredLeads.length > 0 && (
                      <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 max-h-60 overflow-y-auto">
                        {filteredLeads.map((lead) => (
                          <button
                            key={lead.id}
                            onClick={() => handleLeadSelect(lead)}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between border-b border-gray-100 last:border-b-0"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-800">{lead.name}</p>
                              <p className="text-xs text-gray-500">{lead.email}</p>
                            </div>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{lead.status}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">2</span>
                  Analyse de la situation du client
                </h3>
                <div className="grid grid-cols-1 gap-4 ml-10">
                  <textarea
                    placeholder="Besoins du client"
                    value={formData.besoins}
                    onChange={(e) => setFormData({ ...formData, besoins: e.target.value })}
                    rows={3}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                  />
                  <textarea
                    placeholder="Risques identifiés"
                    value={formData.risques}
                    onChange={(e) => setFormData({ ...formData, risques: e.target.value })}
                    rows={3}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                  />
                  <input
                    type="text"
                    placeholder="Budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  />
                  <input
                    type="text"
                    placeholder="Situation familiale"
                    value={formData.situation_familiale}
                    onChange={(e) => setFormData({ ...formData, situation_familiale: e.target.value })}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  />
                  <input
                    type="text"
                    placeholder="Situation professionnelle"
                    value={formData.situation_professionnelle}
                    onChange={(e) => setFormData({ ...formData, situation_professionnelle: e.target.value })}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  />
                  <textarea
                    placeholder="Projets"
                    value={formData.projets}
                    onChange={(e) => setFormData({ ...formData, projets: e.target.value })}
                    rows={2}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                  />
                  <textarea
                    placeholder="Autres remarques"
                    value={formData.autres_remarques}
                    onChange={(e) => setFormData({ ...formData, autres_remarques: e.target.value })}
                    rows={2}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">3</span>
                  Informations sur les contrats proposés
                </h3>
                <div className="grid grid-cols-1 gap-4 ml-10">
                  <input
                    type="text"
                    placeholder="Produits proposés"
                    value={formData.produits_proposes}
                    onChange={(e) => setFormData({ ...formData, produits_proposes: e.target.value })}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  />
                  <textarea
                    placeholder="Garanties"
                    value={formData.garanties}
                    onChange={(e) => setFormData({ ...formData, garanties: e.target.value })}
                    rows={3}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                  />
                  <textarea
                    placeholder="Exclusions"
                    value={formData.exclusions}
                    onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                    rows={3}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                  />
                  <textarea
                    placeholder="Limites"
                    value={formData.limites}
                    onChange={(e) => setFormData({ ...formData, limites: e.target.value })}
                    rows={2}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                  />
                  <textarea
                    placeholder="Conditions"
                    value={formData.conditions}
                    onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                    rows={2}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">4</span>
                  Recommandation d'une solution adaptée
                </h3>
                <div className="grid grid-cols-1 gap-4 ml-10">
                  <input
                    type="text"
                    placeholder="Contrat choisi"
                    value={formData.contrat_choisi}
                    onChange={(e) => setFormData({ ...formData, contrat_choisi: e.target.value })}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  />
                  <input
                    type="text"
                    placeholder="Options"
                    value={formData.options}
                    onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  />
                  <input
                    type="text"
                    placeholder="Montants de garantie"
                    value={formData.montants_garantie}
                    onChange={(e) => setFormData({ ...formData, montants_garantie: e.target.value })}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">5</span>
                  Vérification de l'adéquation
                </h3>
                <div className="ml-10">
                  <label className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-200/50 cursor-pointer hover:bg-blue-100/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.adequation_confirmee}
                      onChange={(e) => setFormData({ ...formData, adequation_confirmee: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Le contrat correspond aux besoins exprimés par le client
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">6</span>
                  Risques en cas de refus de garanties
                </h3>
                <div className="ml-10">
                  <textarea
                    placeholder="Description des risques expliqués au client"
                    value={formData.risques_refus}
                    onChange={(e) => setFormData({ ...formData, risques_refus: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">7</span>
                  Validation et signature
                </h3>
                <div className="grid grid-cols-2 gap-4 ml-10">
                  <input
                    type="text"
                    placeholder="Nom du signataire"
                    value={formData.signature_client}
                    onChange={(e) => setFormData({ ...formData, signature_client: e.target.value })}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  />
                  <input
                    type="date"
                    value={formData.date_signature}
                    onChange={(e) => setFormData({ ...formData, date_signature: e.target.value })}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingConseil(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-white/80 border border-gray-200 text-gray-700 rounded-full text-sm font-light hover:bg-white transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer le devoir de conseil
                </button>
              </div>
            </div>
          </div>
          </>
        )}

        {showNewDevoirForm && (
          <NewDevoirConseil
            onClose={() => {
              setShowNewDevoirForm(false);
              setEditingConseil(null);
              loadConseils();
            }}
            onSubmit={(data) => {
              console.log('Form data submitted:', data);
              setShowNewDevoirForm(false);
              setEditingConseil(null);
              loadConseils();
            }}
            initialData={editingConseil || undefined}
            conseilId={editingConseil?.id}
          />
        )}
      </div>

      {viewingConseil && (
        <PDFViewerModal conseil={viewingConseil} onClose={() => setViewingConseil(null)} />
      )}
    </div>
  );
}
