import { z } from "zod";

// Import tools from parent src directory
import { CreateInvoiceTool } from "../../src/tools/create-invoice.tool.js";
import { ReadInvoiceTool } from "../../src/tools/read-invoice.tool.js";
import { SearchInvoicesTool } from "../../src/tools/search-invoices.tool.js";
import { UpdateInvoiceTool } from "../../src/tools/update-invoice.tool.js";
import { DeleteInvoiceTool } from "../../src/tools/delete-invoice.tool.js";

import { CreateAccountTool } from "../../src/tools/create-account.tool.js";
import { GetAccountTool } from "../../src/tools/get-account.tool.js";
import { UpdateAccountTool } from "../../src/tools/update-account.tool.js";
import { SearchAccountsTool } from "../../src/tools/search-accounts.tool.js";

import { CreateItemTool } from "../../src/tools/create-item.tool.js";
import { ReadItemTool } from "../../src/tools/read-item.tool.js";
import { UpdateItemTool } from "../../src/tools/update-item.tool.js";
import { DeleteItemTool } from "../../src/tools/delete-item.tool.js";
import { SearchItemsTool } from "../../src/tools/search-items.tool.js";

import { CreateCustomerTool } from "../../src/tools/create-customer.tool.js";
import { GetCustomerTool } from "../../src/tools/get-customer.tool.js";
import { UpdateCustomerTool } from "../../src/tools/update-customer.tool.js";
import { DeleteCustomerTool } from "../../src/tools/delete-customer.tool.js";
import { SearchCustomersTool } from "../../src/tools/search-customers.tool.js";

import { CreateEstimateTool } from "../../src/tools/create-estimate.tool.js";
import { GetEstimateTool } from "../../src/tools/get-estimate.tool.js";
import { UpdateEstimateTool } from "../../src/tools/update-estimate.tool.js";
import { DeleteEstimateTool } from "../../src/tools/delete-estimate.tool.js";
import { SearchEstimatesTool } from "../../src/tools/search-estimates.tool.js";

import { CreateBillTool } from "../../src/tools/create-bill.tool.js";
import { GetBillTool } from "../../src/tools/get-bill.tool.js";
import { UpdateBillTool } from "../../src/tools/update-bill.tool.js";
import { DeleteBillTool } from "../../src/tools/delete-bill.tool.js";
import { SearchBillsTool } from "../../src/tools/search-bills.tool.js";

import { CreateVendorTool } from "../../src/tools/create-vendor.tool.js";
import { GetVendorTool } from "../../src/tools/get-vendor.tool.js";
import { UpdateVendorTool } from "../../src/tools/update-vendor.tool.js";
import { DeleteVendorTool } from "../../src/tools/delete-vendor.tool.js";
import { SearchVendorsTool } from "../../src/tools/search-vendors.tool.js";

import { CreateEmployeeTool } from "../../src/tools/create-employee.tool.js";
import { GetEmployeeTool } from "../../src/tools/get-employee.tool.js";
import { UpdateEmployeeTool } from "../../src/tools/update-employee.tool.js";
import { DeleteEmployeeTool } from "../../src/tools/delete-employee.tool.js";
import { SearchEmployeesTool } from "../../src/tools/search-employees.tool.js";

import { CreateJournalEntryTool } from "../../src/tools/create-journal-entry.tool.js";
import { GetJournalEntryTool } from "../../src/tools/get-journal-entry.tool.js";
import { UpdateJournalEntryTool } from "../../src/tools/update-journal-entry.tool.js";
import { DeleteJournalEntryTool } from "../../src/tools/delete-journal-entry.tool.js";
import { SearchJournalEntriesTool } from "../../src/tools/search-journal-entries.tool.js";

import { CreateBillPaymentTool } from "../../src/tools/create-bill-payment.tool.js";
import { GetBillPaymentTool } from "../../src/tools/get-bill-payment.tool.js";
import { UpdateBillPaymentTool } from "../../src/tools/update-bill-payment.tool.js";
import { DeleteBillPaymentTool } from "../../src/tools/delete-bill-payment.tool.js";
import { SearchBillPaymentsTool } from "../../src/tools/search-bill-payments.tool.js";

import { CreatePurchaseTool } from "../../src/tools/create-purchase.tool.js";
import { GetPurchaseTool } from "../../src/tools/get-purchase.tool.js";
import { UpdatePurchaseTool } from "../../src/tools/update-purchase.tool.js";
import { DeletePurchaseTool } from "../../src/tools/delete-purchase.tool.js";
import { SearchPurchasesTool } from "../../src/tools/search-purchases.tool.js";

import { CreatePaymentTool } from "../../src/tools/create-payment.tool.js";
import { GetPaymentTool } from "../../src/tools/get-payment.tool.js";
import { UpdatePaymentTool } from "../../src/tools/update-payment.tool.js";
import { DeletePaymentTool } from "../../src/tools/delete-payment.tool.js";
import { SearchPaymentsTool } from "../../src/tools/search-payments.tool.js";

import { CreateSalesReceiptTool } from "../../src/tools/create-sales-receipt.tool.js";
import { GetSalesReceiptTool } from "../../src/tools/get-sales-receipt.tool.js";
import { UpdateSalesReceiptTool } from "../../src/tools/update-sales-receipt.tool.js";
import { DeleteSalesReceiptTool } from "../../src/tools/delete-sales-receipt.tool.js";
import { SearchSalesReceiptsTool } from "../../src/tools/search-sales-receipts.tool.js";

import { CreateCreditMemoTool } from "../../src/tools/create-credit-memo.tool.js";
import { GetCreditMemoTool } from "../../src/tools/get-credit-memo.tool.js";
import { UpdateCreditMemoTool } from "../../src/tools/update-credit-memo.tool.js";
import { DeleteCreditMemoTool } from "../../src/tools/delete-credit-memo.tool.js";
import { SearchCreditMemosTool } from "../../src/tools/search-credit-memos.tool.js";

import { CreateRefundReceiptTool } from "../../src/tools/create-refund-receipt.tool.js";
import { GetRefundReceiptTool } from "../../src/tools/get-refund-receipt.tool.js";
import { UpdateRefundReceiptTool } from "../../src/tools/update-refund-receipt.tool.js";
import { DeleteRefundReceiptTool } from "../../src/tools/delete-refund-receipt.tool.js";
import { SearchRefundReceiptsTool } from "../../src/tools/search-refund-receipts.tool.js";

import { CreatePurchaseOrderTool } from "../../src/tools/create-purchase-order.tool.js";
import { GetPurchaseOrderTool } from "../../src/tools/get-purchase-order.tool.js";
import { UpdatePurchaseOrderTool } from "../../src/tools/update-purchase-order.tool.js";
import { DeletePurchaseOrderTool } from "../../src/tools/delete-purchase-order.tool.js";
import { SearchPurchaseOrdersTool } from "../../src/tools/search-purchase-orders.tool.js";

import { CreateVendorCreditTool } from "../../src/tools/create-vendor-credit.tool.js";
import { GetVendorCreditTool } from "../../src/tools/get-vendor-credit.tool.js";
import { UpdateVendorCreditTool } from "../../src/tools/update-vendor-credit.tool.js";
import { DeleteVendorCreditTool } from "../../src/tools/delete-vendor-credit.tool.js";
import { SearchVendorCreditsTool } from "../../src/tools/search-vendor-credits.tool.js";

import { CreateDepositTool } from "../../src/tools/create-deposit.tool.js";
import { GetDepositTool } from "../../src/tools/get-deposit.tool.js";
import { UpdateDepositTool } from "../../src/tools/update-deposit.tool.js";
import { DeleteDepositTool } from "../../src/tools/delete-deposit.tool.js";
import { SearchDepositsTool } from "../../src/tools/search-deposits.tool.js";

import { CreateTransferTool } from "../../src/tools/create-transfer.tool.js";
import { GetTransferTool } from "../../src/tools/get-transfer.tool.js";
import { UpdateTransferTool } from "../../src/tools/update-transfer.tool.js";
import { DeleteTransferTool } from "../../src/tools/delete-transfer.tool.js";
import { SearchTransfersTool } from "../../src/tools/search-transfers.tool.js";

import { CreateTimeActivityTool } from "../../src/tools/create-time-activity.tool.js";
import { GetTimeActivityTool } from "../../src/tools/get-time-activity.tool.js";
import { UpdateTimeActivityTool } from "../../src/tools/update-time-activity.tool.js";
import { DeleteTimeActivityTool } from "../../src/tools/delete-time-activity.tool.js";
import { SearchTimeActivitiesTool } from "../../src/tools/search-time-activities.tool.js";

import { CreateClassTool } from "../../src/tools/create-class.tool.js";
import { GetClassTool } from "../../src/tools/get-class.tool.js";
import { UpdateClassTool } from "../../src/tools/update-class.tool.js";
import { SearchClassesTool } from "../../src/tools/search-classes.tool.js";

import { CreateDepartmentTool } from "../../src/tools/create-department.tool.js";
import { GetDepartmentTool } from "../../src/tools/get-department.tool.js";
import { UpdateDepartmentTool } from "../../src/tools/update-department.tool.js";
import { SearchDepartmentsTool } from "../../src/tools/search-departments.tool.js";

import { CreateTermTool } from "../../src/tools/create-term.tool.js";
import { GetTermTool } from "../../src/tools/get-term.tool.js";
import { UpdateTermTool } from "../../src/tools/update-term.tool.js";
import { SearchTermsTool } from "../../src/tools/search-terms.tool.js";

import { CreatePaymentMethodTool } from "../../src/tools/create-payment-method.tool.js";
import { GetPaymentMethodTool } from "../../src/tools/get-payment-method.tool.js";
import { UpdatePaymentMethodTool } from "../../src/tools/update-payment-method.tool.js";
import { SearchPaymentMethodsTool } from "../../src/tools/search-payment-methods.tool.js";

import { SearchBudgetsTool } from "../../src/tools/search-budgets.tool.js";

import { GetTaxCodeTool } from "../../src/tools/get-tax-code.tool.js";
import { SearchTaxCodesTool } from "../../src/tools/search-tax-codes.tool.js";

import { GetTaxRateTool } from "../../src/tools/get-tax-rate.tool.js";
import { SearchTaxRatesTool } from "../../src/tools/search-tax-rates.tool.js";

import { GetTaxAgencyTool } from "../../src/tools/get-tax-agency.tool.js";
import { SearchTaxAgenciesTool } from "../../src/tools/search-tax-agencies.tool.js";

import { GetCompanyInfoTool } from "../../src/tools/get-company-info.tool.js";
import { UpdateCompanyInfoTool } from "../../src/tools/update-company-info.tool.js";

import { CreateAttachableTool } from "../../src/tools/create-attachable.tool.js";
import { GetAttachableTool } from "../../src/tools/get-attachable.tool.js";
import { UpdateAttachableTool } from "../../src/tools/update-attachable.tool.js";
import { DeleteAttachableTool } from "../../src/tools/delete-attachable.tool.js";
import { SearchAttachablesTool } from "../../src/tools/search-attachables.tool.js";

import { GetBalanceSheetTool } from "../../src/tools/get-balance-sheet.tool.js";
import { GetProfitAndLossTool } from "../../src/tools/get-profit-and-loss.tool.js";
import { GetCashFlowTool } from "../../src/tools/get-cash-flow.tool.js";
import { GetTrialBalanceTool } from "../../src/tools/get-trial-balance.tool.js";
import { GetGeneralLedgerTool } from "../../src/tools/get-general-ledger.tool.js";

import { GetCustomerSalesTool } from "../../src/tools/get-customer-sales.tool.js";
import { GetAgedReceivablesTool } from "../../src/tools/get-aged-receivables.tool.js";
import { GetCustomerBalanceTool } from "../../src/tools/get-customer-balance.tool.js";

import { GetAgedPayablesTool } from "../../src/tools/get-aged-payables.tool.js";
import { GetVendorExpensesTool } from "../../src/tools/get-vendor-expenses.tool.js";
import { GetVendorBalanceTool } from "../../src/tools/get-vendor-balance.tool.js";

interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
  outputSchema?: any;
  annotations?: {
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
  };
  handler: (args: any) => Promise<any>;
}

/**
 * Registry of all QuickBooks tools
 * Converts tool definitions to MCP-compatible format
 */
export class QuickBooksToolRegistry {
  private static tools: Map<string, MCPTool> | null = null;

  private static convertToolToMCP(tool: any): MCPTool {
    // Convert Zod schema to JSON Schema for inputSchema
    const inputSchema = {
      type: "object" as const,
      properties: {} as Record<string, any>,
      required: [] as string[],
    };

    // Simple conversion - in production you'd want a proper Zod-to-JSON-Schema converter
    if (tool.schema && tool.schema._def) {
      const shape = tool.schema._def.shape?.() || {};
      for (const [key, value] of Object.entries(shape)) {
        inputSchema.properties[key] = { type: "string" }; // Simplified
        if ((value as any)?.isOptional?.() === false) {
          inputSchema.required.push(key);
        }
      }
    }

    // Determine annotations based on tool name
    const annotations: MCPTool["annotations"] = {};
    if (
      tool.name.startsWith("get_") ||
      tool.name.startsWith("search_") ||
      tool.name.startsWith("read_")
    ) {
      annotations.readOnlyHint = true;
    }
    if (tool.name.startsWith("delete_")) {
      annotations.destructiveHint = true;
    }

    return {
      name: tool.name,
      description: tool.description,
      inputSchema,
      annotations: Object.keys(annotations).length > 0 ? annotations : undefined,
      handler: async (args: any) => {
        try {
          const result = await tool.handler({ params: args });
          // Extract text content if it's in MCP format
          if (result.content && Array.isArray(result.content)) {
            const textContent = result.content.find((c: any) => c.type === "text");
            if (textContent) {
              try {
                return JSON.parse(textContent.text);
              } catch {
                return { success: true, data: textContent.text };
              }
            }
          }
          return { success: true, data: result };
        } catch (error: any) {
          return {
            success: false,
            error: error?.message || String(error),
          };
        }
      },
    };
  }

  static getAllTools(): Map<string, MCPTool> {
    if (this.tools) {
      return this.tools;
    }

    this.tools = new Map();

    // Register all tools
    const allTools = [
      // Invoices
      CreateInvoiceTool,
      ReadInvoiceTool,
      SearchInvoicesTool,
      UpdateInvoiceTool,
      DeleteInvoiceTool,
      // Accounts
      CreateAccountTool,
      GetAccountTool,
      UpdateAccountTool,
      SearchAccountsTool,
      // Items
      CreateItemTool,
      ReadItemTool,
      UpdateItemTool,
      DeleteItemTool,
      SearchItemsTool,
      // Customers
      CreateCustomerTool,
      GetCustomerTool,
      UpdateCustomerTool,
      DeleteCustomerTool,
      SearchCustomersTool,
      // Estimates
      CreateEstimateTool,
      GetEstimateTool,
      UpdateEstimateTool,
      DeleteEstimateTool,
      SearchEstimatesTool,
      // Bills
      CreateBillTool,
      GetBillTool,
      UpdateBillTool,
      DeleteBillTool,
      SearchBillsTool,
      // Vendors
      CreateVendorTool,
      GetVendorTool,
      UpdateVendorTool,
      DeleteVendorTool,
      SearchVendorsTool,
      // Employees
      CreateEmployeeTool,
      GetEmployeeTool,
      UpdateEmployeeTool,
      DeleteEmployeeTool,
      SearchEmployeesTool,
      // Journal Entries
      CreateJournalEntryTool,
      GetJournalEntryTool,
      UpdateJournalEntryTool,
      DeleteJournalEntryTool,
      SearchJournalEntriesTool,
      // Bill Payments
      CreateBillPaymentTool,
      GetBillPaymentTool,
      UpdateBillPaymentTool,
      DeleteBillPaymentTool,
      SearchBillPaymentsTool,
      // Purchases
      CreatePurchaseTool,
      GetPurchaseTool,
      UpdatePurchaseTool,
      DeletePurchaseTool,
      SearchPurchasesTool,
      // Payments
      CreatePaymentTool,
      GetPaymentTool,
      UpdatePaymentTool,
      DeletePaymentTool,
      SearchPaymentsTool,
      // Sales Receipts
      CreateSalesReceiptTool,
      GetSalesReceiptTool,
      UpdateSalesReceiptTool,
      DeleteSalesReceiptTool,
      SearchSalesReceiptsTool,
      // Credit Memos
      CreateCreditMemoTool,
      GetCreditMemoTool,
      UpdateCreditMemoTool,
      DeleteCreditMemoTool,
      SearchCreditMemosTool,
      // Refund Receipts
      CreateRefundReceiptTool,
      GetRefundReceiptTool,
      UpdateRefundReceiptTool,
      DeleteRefundReceiptTool,
      SearchRefundReceiptsTool,
      // Purchase Orders
      CreatePurchaseOrderTool,
      GetPurchaseOrderTool,
      UpdatePurchaseOrderTool,
      DeletePurchaseOrderTool,
      SearchPurchaseOrdersTool,
      // Vendor Credits
      CreateVendorCreditTool,
      GetVendorCreditTool,
      UpdateVendorCreditTool,
      DeleteVendorCreditTool,
      SearchVendorCreditsTool,
      // Deposits
      CreateDepositTool,
      GetDepositTool,
      UpdateDepositTool,
      DeleteDepositTool,
      SearchDepositsTool,
      // Transfers
      CreateTransferTool,
      GetTransferTool,
      UpdateTransferTool,
      DeleteTransferTool,
      SearchTransfersTool,
      // Time Activities
      CreateTimeActivityTool,
      GetTimeActivityTool,
      UpdateTimeActivityTool,
      DeleteTimeActivityTool,
      SearchTimeActivitiesTool,
      // Classes
      CreateClassTool,
      GetClassTool,
      UpdateClassTool,
      SearchClassesTool,
      // Departments
      CreateDepartmentTool,
      GetDepartmentTool,
      UpdateDepartmentTool,
      SearchDepartmentsTool,
      // Terms
      CreateTermTool,
      GetTermTool,
      UpdateTermTool,
      SearchTermsTool,
      // Payment Methods
      CreatePaymentMethodTool,
      GetPaymentMethodTool,
      UpdatePaymentMethodTool,
      SearchPaymentMethodsTool,
      // Budgets
      SearchBudgetsTool,
      // Tax Codes
      GetTaxCodeTool,
      SearchTaxCodesTool,
      // Tax Rates
      GetTaxRateTool,
      SearchTaxRatesTool,
      // Tax Agencies
      GetTaxAgencyTool,
      SearchTaxAgenciesTool,
      // Company Info
      GetCompanyInfoTool,
      UpdateCompanyInfoTool,
      // Attachables
      CreateAttachableTool,
      GetAttachableTool,
      UpdateAttachableTool,
      DeleteAttachableTool,
      SearchAttachablesTool,
      // Financial Reports
      GetBalanceSheetTool,
      GetProfitAndLossTool,
      GetCashFlowTool,
      GetTrialBalanceTool,
      GetGeneralLedgerTool,
      // Sales/AR Reports
      GetCustomerSalesTool,
      GetAgedReceivablesTool,
      GetCustomerBalanceTool,
      // Expense/AP Reports
      GetAgedPayablesTool,
      GetVendorExpensesTool,
      GetVendorBalanceTool,
    ];

    for (const tool of allTools) {
      const mcpTool = this.convertToolToMCP(tool);
      this.tools.set(mcpTool.name, mcpTool);
    }

    // Add a special qbo_list_tools for catalog
    this.tools.set("qbo_list_tools", {
      name: "qbo_list_tools",
      description:
        "Get a comprehensive catalog of all available QuickBooks tools grouped by category",
      inputSchema: { type: "object" as const, properties: {} },
      outputSchema: {
        type: "object" as const,
        properties: {
          success: { type: "boolean" as const },
          data: {
            type: "object" as const,
            properties: {
              totalTools: { type: "number" as const },
              categories: { type: "object" as const },
            },
          },
        },
      },
      annotations: { readOnlyHint: true },
      handler: async () => {
        const categories: Record<string, any[]> = {};

        for (const [name, tool] of this.tools!) {
          if (name === "qbo_list_tools") continue;

          // Categorize by entity type
          let category = "Other";
          if (name.includes("invoice")) category = "Invoices";
          else if (name.includes("customer")) category = "Customers";
          else if (name.includes("estimate")) category = "Estimates";
          else if (name.includes("bill")) category = "Bills";
          else if (name.includes("vendor")) category = "Vendors";
          else if (name.includes("employee")) category = "Employees";
          else if (name.includes("account")) category = "Accounts";
          else if (name.includes("item")) category = "Items";
          else if (name.includes("payment")) category = "Payments";
          else if (name.includes("report") || name.includes("balance") || name.includes("sheet"))
            category = "Reports";

          if (!categories[category]) {
            categories[category] = [];
          }

          categories[category].push({
            name: tool.name,
            description: tool.description,
            readOnly: tool.annotations?.readOnlyHint || false,
            destructive: tool.annotations?.destructiveHint || false,
          });
        }

        return {
          success: true,
          data: {
            totalTools: this.tools!.size - 1, // Exclude qbo_list_tools itself
            categories,
          },
        };
      },
    });

    return this.tools;
  }
}
