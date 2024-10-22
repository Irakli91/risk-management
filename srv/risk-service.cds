
using {riskmanagement as rm} from '../db/schema';

@path: 'service/risk'
service RiskService {
    entity Risks as projection on rm.Risks;
    annotate Risks with @odata.draft.enabled;

    entity Mitigations as projection on rm.Mitigations;
    annotate Mitigations with @odata.draft.enabled;

    entity Items as projection on rm.Items;
    
    function GetRisksByPriority( priority: String ) returns array of Risks;

    function GetAllItems() returns array of Items;
    
    action CreateRisk( riskData: Risks ) returns Risks;

    // BusinessPartner will be used later
    //@readonly entity BusinessPartners as projection on rm.BusinessPartners;
}