const PSPDFKit = window.PSPDFKit;

// We need to inform PSPDFKit where to look for its library assets, i.e. the location of the `pspdfkit-lib` directory.
const baseUrl = `${window.location.protocol}//${window.location.host}/assets/dist/`;

var _instance = null;

async function runner(docPath) {
  await PSPDFKit.load({
    baseUrl,
    container: "#pspdfkit",
    document: docPath,
    toolbarItems: [...PSPDFKit.defaultToolbarItems, { type: "comment" }],
  })
    .then(async (instance) => {
      _instance = instance;
    })
    .catch((error) => {
      console.error(error.message);
    });
}
runner("./assets/Tofu 1.pdf");