namespace riskmanagement;

using {
        managed,
        cuid,
        sap.common.CodeList
} from '@sap/cds/common';
// using an external service from SAP S/4HANA Cloud
using {API_BUSINESS_PARTNER as external} from '../srv/external/API_BUSINESS_PARTNER.csn';

entity Risks : cuid, managed {
        title                   : String(100);
        owner                   : String;
        prio                    : Association to Priority;
        descr                   : String;
        miti                    : Association to Mitigations;
        impact                  : Integer;
        bp                      : Association to BusinessPartners;
        virtual criticality     : Integer;
        virtual PrioCriticality : Integer;
}

entity Mitigations : cuid, managed {
        descr    : String;
        owner    : String;
        timeline : String;
        risks    : Association to many Risks
                           on risks.miti = $self;
}

entity Priority : CodeList {
        key code : String enum {
                    high   = 'H';
                    medium = 'M';
                    low    = 'L';
            };
}

entity BusinessPartners as
        projection on external.A_BusinessPartner {
                key BusinessPartner,
                    BusinessPartnerFullName as FullName,
        }

// Dummy entity
entity Items : cuid {
        title     : String;
        quantity  : Integer;
        createdBy : String; // Stores the user ID of the creator
}
