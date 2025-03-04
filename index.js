import {
  createRectsWhenScrolled,
} from "./helpers.js";

const PSPDFKit = window.PSPDFKit;

// We need to inform PSPDFKit where to look for its library assets, i.e. the location of the `pspdfkit-lib` directory.
const baseUrl = `${window.location.protocol}//${window.location.host}/assets/dist/`;

async function runner(docPath) {
  await PSPDFKit.load({
    baseUrl,
    container: "#pspdfkit",
    document: docPath,
    toolbarItems: [...PSPDFKit.defaultToolbarItems, { type: "comment" }, { type: "content-editor" }],
  })
    .then(async (instance) => {
      window.instance = instance
      const response = await fetch("mapping.json");
      const mappingData = await response.json();
      if (docPath.includes("2")) {
        mappingData.TOFU_2.forEach(element => {
          const overlayDiv = document.createElement("div");
          overlayDiv.style.position = "absolute";
          overlayDiv.style.border = "2px solid blue";        // initial border color
          overlayDiv.style.backgroundColor = "transparent";  // transparent background
          overlayDiv.style.width = `${element.boundingBox.width}px`;
          overlayDiv.style.height = `${element.boundingBox.height}px`;
          overlayDiv.addEventListener("click", () => {
            overlayDiv.style.borderColor = overlayDiv.style.borderColor === "blue" ? "red" : "blue";
          });

          const item = new PSPDFKit.CustomOverlayItem({
            id: `overlay-${element.id}`,
            node: overlayDiv,
            pageIndex: element.pageIndex,
            position: new PSPDFKit.Geometry.Point({ x: element.boundingBox.left, y: element.boundingBox.top })
          });
          instance.setCustomOverlayItem(item);
        });
      }
      //intializing for first page when loaded
      // lazy creating rects when user scrolls to them
      // instance.setViewState(viewState =>
      //   viewState.set(
      //     "interactionMode",
      //     PSPDFKit.InteractionMode.CONTENT_EDITOR
      //   )
      // );
      // setTimeout(() => {
      //   createRectsWhenScrolled(PSPDFKit, instance, 0);
      // }, 2000);
      // instance.addEventListener(
      //   "viewState.currentPageIndex.change",
      //   (newPageIndex) =>
      //     createRectsWhenScrolled(PSPDFKit, instance, newPageIndex)
      // );
      // instance.addEventListener("annotations.press", (event) => {
      //   if (event.annotation instanceof PSPDFKit.Annotations.RectangleAnnotation) {

      //     let annot = event.annotation
      //     if (annot.strokeColor == PSPDFKit.Color.BLUE) {
      //       console.log("Rect clicked BLUE");
      //       annot = annot.set("strokeColor", PSPDFKit.Color.GREY)
      //     }
      //     else {
      //       console.log("Rect clicked ELSE");
      //       annot = annot.set("strokeColor", PSPDFKit.Color.BLUE)
      //     }
      //     instance.update([annot])
      //   }
      // })
    })
    .catch((error) => {
      console.error(error.message);
    });
}
runner("./assets/Tofu 2.pdf");
