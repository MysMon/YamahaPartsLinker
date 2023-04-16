function createLink(url, text) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.textContent = text;

    return link;
}

function createLinkCell(url, text) {
    const newCell = document.createElement("td");
    const link = createLink(url, text);
    newCell.appendChild(link);

    return newCell;
}

function addButtonToTableRow(row, urlGenerator, linkText) {
    if (row.hasAttribute("data-button-added")) return;

    const partNo = row.getAttribute("part-no");
    if (!partNo) return;

    const linkUrl = urlGenerator(partNo);
    const linkCell = createLinkCell(linkUrl, linkText);
    row.appendChild(linkCell);

    row.setAttribute("data-button-added", "true");
}

function processTableRows(table) {
    const rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
        const monotaroUrlGenerator = (partNo) => `https://www.monotaro.com/s/?c=&q=${encodeURIComponent(partNo)}`;
        addButtonToTableRow(row, monotaroUrlGenerator, "Monotaro");
    });
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

// #loading 要素が非表示になるまで待機する関数
async function waitForLoadingToDisappear() {
    const loadingElement = document.querySelector("#loading");

    while (loadingElement && loadingElement.style.display !== "none") {
        await new Promise((resolve) => setTimeout(resolve, 500));
    }
}

function processPartSelection(iframe) {
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const tableSelector = "#list-area > div.table-body-wrap > table";
    const table = iframeDocument.querySelector(tableSelector);

    if (table) {
        processTableRows(table);
        observeTableRowChanges(table);
    } else {
        setTimeout(main, 1000);
    }
}

async function main() {
    const iframe = document.querySelector("#contents-frame");

    if (!iframe) {
        setTimeout(main, 1000);
        return;
    }

    iframe.addEventListener("load", async () => {
        const titleElement = document.querySelector("#title");
        await waitForLoadingToDisappear();

        if (titleElement && titleElement.textContent.trim() === "部品選択") {
            processPartSelection(iframe);
        }
    });
}

main();
