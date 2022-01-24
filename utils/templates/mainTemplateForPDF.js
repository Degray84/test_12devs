module.exports = (data, taxesPercent = 10) => {
  const invoiceList = JSON.parse(data.invoiceList);
  const invoiceSubtotal = invoiceList.reduce((acc, cur) => acc + cur.price, 0);
  const invoiceTaxes = (invoiceSubtotal / 100) * taxesPercent;
  const invoiceTotal = invoiceSubtotal + invoiceTaxes;
  const toLocalDate = (date, month = "short") => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month,
      day: "2-digit",
    });
  };
  console.log(toLocalDate(data.createdAt));
  return `
      <body style="height: 100%; margin: 0; padding: 0; display: flex; flex-direction: column; font-family:Arial, Helvetica, sans-serif">
        <header style="position: relative; display: flex; flex-grow: 0; align-items: center; justify-content: center; width: 100%; height: 150px; background-color: slategray;">
        <h1 style="font-size: 2rem; text-transform: uppercase; z-index: 1; color: white; letter-spacing: 4px;">Brick and Willow Design</h1>
        <div style="position: absolute; width: 100px; height: 100px; border-radius: 50%; background-color: lightpink;"></div>
        </header>
        <main style="flex-grow: 1; display: flex; flex-direction: column; align-items: center; padding: 0 25px;">
            <div style="display: flex; flex-direction: column; align-items: center; padding: 15px 0;">
                <span style="font-size: 1.8rem; padding: 5px 0;">New Invoice</span>
                <span style="display: flex; padding: 10px 0; gap: 5px">
                    <span>$${invoiceTotal}</span>
                    <span>due on</span>
                    <span>${toLocalDate(data.createdAt)}</span>
                </span>
                <a href="#" style="font-family: monospace; font-size: 1.2rem; text-decoration: none; padding: 5px 50px; background-color: slategray; color: white; border-radius: 2px;">Pay invoice</a>
            </div>
            
            <div style="width: 100%; height: 1px; background-color: slategray; margin: 10px 0;"></div>
            <div style="display: flex; flex-direction: column; width:100%; padding: 20px 25px;">
                <div style="display:flex;font-weight: bold; padding:  2px 0; ">
                    <span>Invoice #</span>
                    <span>${data.id}</span>
                </div>
                <span style="padding: 2px 0;">${toLocalDate(data.createdAt, "long")}</span>
                <div style="margin: 10px 0;"></div>
                <span style="font-weight: bold; padding: 2px 0;">Customer</span>
                <span style="padding: 2px 0;">${data.Client.firstname} ${data.Client.lastname}</span>
                <span style="padding: 2px 0;">${data.Client.email}</span>
            </div>
            <div style="width: 100%; height: 1px; background-color: slategray; margin: 10px 0;"></div>
            <div>
                <p>
                    It was pleasure to work with you and your team. Please let me know if you have any questions and we hope you will keep us in mind for future freelance projects. Thank you!
                </p>
            </div>
            <div style="width: 100%; height: 1px; background-color: slategray; margin: 10px 0;"></div>
            <div style="width: 100%; display: flex; flex-direction: column; font-weight: bold;">
                ${invoiceList
                  .map(
                    (invoice) => `<div style="width: 100%; display: flex; padding: 20px 0;">
                    <div style="flex-grow:1;">${invoice.name}</div><div>$${invoice.price}</div>
                </div>`
                  )
                  .join("")}
            </div >
            <div style="width: 100%; height: 1px; background-color: slategray; margin: 10px 0;"></div>
            <div style="width: 100%; display: flex; flex-direction: column;">
                <div style="width: 100%; display: flex; padding: 2px 0;">
                    <div style="flex-grow:1;">Subtotal</div><div>$${invoiceSubtotal}</div>
                </div>
                <div style="width: 100%; display: flex; padding: 2px 0;">
                    <div style="flex-grow:1;">Tax</div><div>$${invoiceTaxes}</div>
                </div>
            </div>
            <div style="width: 100%; height: 1px; background-color: slategray; margin: 10px 0;"></div>
            <div style="width: 100%; display: flex; flex-direction: column; font-weight: bolder; font-size: 2rem;">
                <div style="width: 100%; display: flex; padding: 2px 0;">
                    <div style="flex-grow:1;">Total Due</div><div>$${invoiceTotal}</div>
                </div>
            </div>
        </main>
        <footer style="position: relative; display: flex; flex-direction: column; flex-grow: 0; align-items: center; justify-content: center; width: 100%; padding: 20px 0; background-color:gainsboro;"">
        <span style="font-size: 1.5rem; font-weight: bolder;">Brick and Willow Design</span>
        <span style="font-size: 1.2rem;">101 Main Street, San Francisco, CA 94105</span>
        <div style="margin: 10px 0;"></div>
        <span>Security | Privacy</span>
        <span>© 2022 Square. Inc.</span>
        </footer>
    </body>

      `;
};
