import {
  createRect,
  createRectsWhenScrolled,
  mapLinesForEachPage,
} from "./helpers.js";

const PSPDFKit = window.PSPDFKit;

// We need to inform PSPDFKit where to look for its library assets, i.e. the location of the `pspdfkit-lib` directory.
const baseUrl = `${window.location.protocol}//${window.location.host}/assets/dist/`;

async function runner(docPath) {
  await PSPDFKit.load({
    baseUrl,
    container: "#pspdfkit",
    document: docPath,
    toolbarItems: [...PSPDFKit.defaultToolbarItems, { type: "comment" }],
  })
    .then(async (instance) => {
      //intializing for first page when loaded
      createRectsWhenScrolled(PSPDFKit, instance, 0);
      // lazy creating rects when user scrolls to them
      instance.addEventListener(
        "viewState.currentPageIndex.change",
        (newPageIndex) =>
          createRectsWhenScrolled(PSPDFKit, instance, newPageIndex)
      );
    })
    .catch((error) => {
      console.error(error.message);
    });
}
runner("./assets/Tofu 2.pdf");
