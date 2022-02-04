const { createInvoice } = require("./createInvoice.js");

const accStat = {
  AccInfo: {
    RegNo: 1,
    name: "AQEEL KARIM DHEDHI SECURITIES (PVT) LTD",
    address: "618 CONTINENTAL TRADE CENTRE BLOCK-VIII CLIFTON",
    city: "KARACHI",
    country: "PAKISTAN",
    zakat_status: "ZAKAT DECLALRATION ATTACHED"
  },
  items: [
    {
      item: "TC 100",
      description: "Toner Cartridge",
      quantity: 2,
      amount: 6
    },
    {
      item: "USB_EXT",
      description: "USB Cable Extender",
      quantity: 1,
      amount: 2000
    }
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234
};

createInvoice(accStat, "invoice.pdf");
