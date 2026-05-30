import { quickbooksClient } from "../clients/quickbooks-client.js";
import { formatError } from "../helpers/format-error.js";
export async function updateQuickbooksCompanyInfo(data) {
    try {
        await quickbooksClient.authenticate();
        const quickbooks = quickbooksClient.getQuickbooks();
        const payload = { Id: data.id, SyncToken: data.sync_token, sparse: true };
        if (data.company_name)
            payload.CompanyName = data.company_name;
        if (data.legal_name)
            payload.LegalName = data.legal_name;
        if (data.company_addr) {
            payload.CompanyAddr = {};
            if (data.company_addr.line1)
                payload.CompanyAddr.Line1 = data.company_addr.line1;
            if (data.company_addr.city)
                payload.CompanyAddr.City = data.company_addr.city;
            if (data.company_addr.country_sub_division_code)
                payload.CompanyAddr.CountrySubDivisionCode = data.company_addr.country_sub_division_code;
            if (data.company_addr.postal_code)
                payload.CompanyAddr.PostalCode = data.company_addr.postal_code;
            if (data.company_addr.country)
                payload.CompanyAddr.Country = data.company_addr.country;
        }
        if (data.primary_phone)
            payload.PrimaryPhone = { FreeFormNumber: data.primary_phone };
        if (data.email)
            payload.Email = { Address: data.email };
        if (data.web_addr)
            payload.WebAddr = { URI: data.web_addr };
        return new Promise((resolve) => {
            quickbooks.updateCompanyInfo(payload, (err, updated) => {
                if (err)
                    resolve({ result: null, isError: true, error: formatError(err) });
                else
                    resolve({ result: updated, isError: false, error: null });
            });
        });
    }
    catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
