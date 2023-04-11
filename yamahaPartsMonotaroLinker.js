function addButtonToTableRow(row) {
    if (row.hasAttribute("data-button-added")) return;

    const partNo = row.getAttribute("part-no");
    if (!partNo) return;

    const monotaroUrl = `https://www.monotaro.com/s/?c=&q=${encodeURIComponent(partNo)}`;

    const newCell = document.createElement("td");
    const link = document.createElement("a");
    link.href = monotaroUrl;
    link.target = "_blank";
    link.textContent = "Monotaro";
    newCell.appendChild(link);
    row.appendChild(newCell);

    row.setAttribute("data-button-added", "true");
}

function processTableRows(table) {
    const rows = table.querySelectorAll("tr");
    rows.forEach(addButtonToTableRow);
}

function observeTableRowChanges(table) {
    const observer = new MutationObserver(() => {
        processTableRows(table);
    });

    observer.observe(table, {
        childList: true,
        subtree: false,
    });
}

async function waitForLoadingToDisappear() {
    const loadingElement = document.querySelector("#loading");

    while (loadingElement && loadingElement.style.display !== "none") {
        await new Promise((resolve) => setTimeout(resolve, 500));
    }
}

async function main() {
    const iframe = document.querySelector("#contents-frame");

    if (iframe) {
        iframe.addEventListener("load", async () => {
            await waitForLoadingToDisappear();

            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            const tableSelector = "#list-area > div.table-body-wrap > table";
            const table = iframeDocument.querySelector(tableSelector);

            if (table) {
                processTableRows(table);
                observeTableRowChanges(table);
            } else {
                setTimeout(() => main(), 1000);
            }
        });
    } else {
        setTimeout(main, 1000);
    }
}

main();
