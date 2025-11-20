import { Search, Paperclip } from 'lucide-react';
import { Lead } from '../../types';

interface GeneralTabProps {
  formData: any;
  searchQuery: string;
  searchResults: Lead[];
  showSearchResults: boolean;
  hasAttachment: boolean;
  onSearch: (query: string) => void;
  onSelectLead: (lead: Lead) => void;
  onUpdateField: (field: string, value: string | boolean) => void;
  onShowRecueilModal: () => void;
}

export default function GeneralTab({
  formData,
  searchQuery,
  searchResults,
  showSearchResults,
  hasAttachment,
  onSearch,
  onSelectLead,
  onUpdateField,
  onShowRecueilModal
}: GeneralTabProps) {
  return (
    <div className="space-y-6">
      <div className="search-container relative">
        <label className="block text-sm font-normal text-gray-700 mb-2">
          Rechercher un lead
        </label>
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => searchQuery && onSearch(searchQuery)}
            placeholder="Rechercher un lead..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
          />
        </div>
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-2 glass-card floating-shadow max-h-60 overflow-y-auto">
            {searchResults.map((lead) => (
              <button
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{lead.first_name} {lead.last_name}</p>
                  <p className="text-xs text-gray-500">{lead.email}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{lead.status}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-normal text-gray-700">TNS</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.actif}
            onChange={(e) => onUpdateField('actif', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        </label>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            <span className="text-red-500">*</span> Civilité
          </label>
          <select
            value={formData.civilite}
            onChange={(e) => onUpdateField('civilite', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 bg-white"
          >
            <option>M.</option>
            <option>Mme.</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            <span className="text-red-500">*</span> Nom
          </label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => onUpdateField('nom', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            <span className="text-red-500">*</span> Prénom
          </label>
          <input
            type="text"
            value={formData.prenom}
            onChange={(e) => onUpdateField('prenom', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            <span className="text-red-500">*</span> Téléphone du contact
          </label>
          <input
            type="tel"
            value={formData.telephone}
            onChange={(e) => onUpdateField('telephone', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">
            <span className="text-red-500">*</span> Email du contact
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onUpdateField('email', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">Site internet</label>
          <input
            type="url"
            value={formData.site_internet}
            onChange={(e) => onUpdateField('site_internet', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-normal text-gray-700">Actif</span>
            <input
              type="checkbox"
              checked={formData.actif}
              onChange={(e) => onUpdateField('actif', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-normal text-gray-700 mb-2">Adresse</label>
          <input
            type="text"
            value={formData.adresse}
            onChange={(e) => onUpdateField('adresse', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">Ville</label>
          <input
            type="text"
            value={formData.ville}
            onChange={(e) => onUpdateField('ville', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">Code Postal</label>
          <input
            type="text"
            value={formData.code_postal}
            onChange={(e) => onUpdateField('code_postal', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">Date de Naissance</label>
          <input
            type="date"
            value={formData.date_naissance}
            onChange={(e) => onUpdateField('date_naissance', e.target.value)}
            placeholder="Sélectionner une date"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">Statut Professionnel</label>
          <select
            value={formData.statut_professionnel}
            onChange={(e) => onUpdateField('statut_professionnel', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 bg-white"
          >
            <option value=""></option>
            <option>Salarié</option>
            <option>Indépendant</option>
            <option>Chef d'entreprise</option>
            <option>Retraité</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">Profession</label>
          <input
            type="text"
            value={formData.profession}
            onChange={(e) => onUpdateField('profession', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">Caisse professionnelle</label>
          <select
            value={formData.caisse_professionnelle}
            onChange={(e) => onUpdateField('caisse_professionnelle', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 bg-white"
          >
            <option value=""></option>
            <option>CIPAV</option>
            <option>CARMF</option>
            <option>CARPIMKO</option>
            <option>CAVP</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">Rémuneration</label>
          <input
            type="text"
            value={formData.remuneration}
            onChange={(e) => onUpdateField('remuneration', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">Dividende</label>
          <input
            type="text"
            value={formData.dividende}
            onChange={(e) => onUpdateField('dividende', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">Crédit en cours</label>
          <input
            type="text"
            value={formData.credit_en_cours}
            onChange={(e) => onUpdateField('credit_en_cours', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-normal text-gray-700 mb-2">Autres revenus</label>
          <input
            type="text"
            value={formData.autres_revenus}
            onChange={(e) => onUpdateField('autres_revenus', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-normal text-gray-700 mb-2">Commentaire</label>
        <textarea
          value={formData.commentaire}
          onChange={(e) => onUpdateField('commentaire', e.target.value)}
          rows={4}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 resize-none"
        />
      </div>

      <div className="bg-blue-50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-gray-800 dark:text-gray-200 font-normal text-sm mb-2">
              Recueil des exigences et des besoins pour des opérations d'assurance vie, de retraite ou de capitalisation
            </p>
            <p className="text-gray-600 dark:text-gray-400 font-light text-xs">
              La partie des exigences et besoins vise à identifier les attentes et les besoins s'agissant de la souscription ou de l'opération envisagée (Reversement, arbitrage, ...)
            </p>
          </div>
          {hasAttachment && (
            <div className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-blue-100 border border-blue-200 rounded-full flex-shrink-0">
              <Paperclip className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Pièce jointe</span>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <button
            onClick={onShowRecueilModal}
            className="px-8 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-full text-sm font-light hover:bg-blue-50 transition-all"
          >
            Compléter
          </button>
        </div>
      </div>
    </div>
  );
}
