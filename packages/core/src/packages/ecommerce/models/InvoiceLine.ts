
export const InvoiceLine: PModel = {
    info: {
        name: 'InvoiceLine',
        label: 'Invoice Line',
        description: 'Invoice Line',
        managed: true,
        prefix: 'INVOICE_LINE'
    },
    fields: {
        productItem: {
            type: "relationship",
            ref: "ProductItem",
        },
        quantity: {
            type: "number",
        },
        amount: {
            type: "float",
        },
        invoice: {
            type: "relationship",
            ref: "Invoice"
        },
        PriceBookItem: {
            type: "relationship",
            ref: "PriceBookItem"
        }
    },
    options: {
        historyTracking: false
    }
}