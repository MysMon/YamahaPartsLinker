const createLink = (url: string, text: string): HTMLAnchorElement => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.textContent = text;

    return link;
};

const createLinkCell = (url: string, text: string): HTMLTableCellElement => {
    const newCell = document.createElement("td");
    const link = createLink(url, text);
    newCell.appendChild(link);

    return newCell;
};

const addButtonToTableRow = (row: HTMLTableRowElement, urlGenerator: (partNo: string) => string, linkText: string): void => {
    if (row.hasAttribute("data-button-added")) return;

    const partNo = row.getAttribute("part-no");
    if (!partNo) return;

    const linkUrl = urlGenerator(partNo);
    const linkCell = createLinkCell(linkUrl, linkText);
    row.appendChild(linkCell);

    row.setAttribute("data-button-added", "true");
};

const processTableRows = (table: HTMLTableElement): void => {
    const rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
        const monotaroUrlGenerator = (partNo: string) => `https://www.monotaro.com/s/?c=&q=${encodeURIComponent(partNo)}`;
        addButtonToTableRow(row as HTMLTableRowElement, monotaroUrlGenerator, "Monotaro");
    });
};

const observeTableRowChanges = (table: HTMLTableElement): void => {
    const observer = new MutationObserver(() => {
        processTableRows(table);
    });

    observer.observe(table, {
        childList: true,
        subtree: false,
    });
};

const waitForLoadingToDisappear = async (): Promise<void> => {
    const loadingElement = document.querySelector("#loading");

    while (loadingElement && loadingElement.style.display !== "none") {
        await new Promise((resolve) => setTimeout(resolve, 500));
    }
};

const processPartSelection = (iframe: HTMLIFrameElement): void => {
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const tableSelector = "#list-area > div.table-body-wrap > table";
    const table = iframeDocument.querySelector(tableSelector) as HTMLTableElement;

    if (table) {
        processTableRows(table);
        observeTableRowChanges(table);
    } else {
        setTimeout(main, 1000);
    }
};

const main = async (): Promise<void> => {
    const iframe = document.querySelector("#contents-frame") as HTMLIFrameElement;

    if (!iframe) {
        setTimeout(main, 1000);
        return;
    }

    iframe.addEventListener("load", async () => {
        const titleElement = document.querySelector("#title") as HTMLHeadingElement;
        await waitForLoadingToDisappear();

        if (titleElement && titleElement.textContent.trim() === "部品選択") {
            processPartSelection(iframe);
        }
    });
};

main();
