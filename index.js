const PSPDFKit = window.PSPDFKit;

// We need to inform PSPDFKit where to look for its library assets, i.e. the location of the `pspdfkit-lib` directory.
const baseUrl = `${window.location.protocol}//${window.location.host}/assets/dist/`;
const response = await fetch("mapping.json");
const mappingData = await response.json();
const content = await fetch("content.json");
const contentData = await content.json();

let editing = false;
let selected = [];
let overlays = [];

async function runner(docPath) {
  const contentBoxes = {
    type: "custom",
    id: "content-boxes",
    title: "Content Boxes",
    icon: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><rect x="5" y="5" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2"/><rect x="9" y="9" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
    onPress: (event) => {
      
      if (editing) {
        overlays.forEach(overlayId => {
          instance.removeCustomOverlayItem(overlayId);
        });
        overlays = [];
        selected = [];
      } else {
        mappingData.TOFU_2.forEach(element => {
          const overlayDiv = document.createElement("div");
          overlayDiv.style.position = "absolute";
          overlayDiv.style.border = "2px solid blue";        // initial border color
          overlayDiv.style.backgroundColor = "transparent";  // transparent background
          overlayDiv.style.width = `${element.boundingBox.width}px`;
          overlayDiv.style.height = `${element.boundingBox.height}px`;
          
          overlayDiv.addEventListener("click", () => {
            overlayDiv.style.borderColor = overlayDiv.style.borderColor === "blue" ? "red" : "blue";
            selected.push(element.id);
            console.log(selected);
          });

          const item = new PSPDFKit.CustomOverlayItem({
            id: `overlay-${element.id}`,
            node: overlayDiv,
            pageIndex: element.pageIndex,
            position: new PSPDFKit.Geometry.Point({ x: element.boundingBox.left, y: element.boundingBox.top })
          });
          overlays.push(`overlay-${element.id}`);
          instance.setCustomOverlayItem(item);
        });
      }

      editing = !editing;
    }
  };

  const ai = {
    type: "custom",
    id: "ai",
    title: "AI Replace",
    icon: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><text x="4" y="17" font-family="sans-serif" font-size="14" font-weight="bold" fill="currentColor">AI</text></svg>',
    onPress: async (event) => {
      if (editing && selected.length > 0) {
        for (const id of selected) {
          for (const content of contentData) {
            const element = mappingData.TOFU_2.find(element => element.id === id);
            if (content.id === element.id) {
              const annotation = new PSPDFKit.Annotations.TextAnnotation({
                backgroundColor: new PSPDFKit.Color({ r: 25, g: 25, b: 25 }),
                text: { format: "plain", value : content.text },
                font: content.font,
                fontColor: PSPDFKit.Color.WHITE,
                fontSize: content.fontSize,
                isBold: content.isBold,
                pageIndex: element.pageIndex,
                boundingBox: new PSPDFKit.Geometry.Rect({ left: element.boundingBox.left, top: element.boundingBox.top, width: element.boundingBox.width, height: element.boundingBox.height +17}),
              });

              const annotationId = await window.instance.create(annotation);
            }
          }
        
        }
        instance.applyOperations([
          {
            type: "flattenAnnotations",
            pageIndexes: [0]
          }
        ]);
      }
    }
  };

  await PSPDFKit.load({
    baseUrl,
    container: "#pspdfkit",
    document: docPath,
    toolbarItems: [...PSPDFKit.defaultToolbarItems, { type: "content-editor" }, contentBoxes, ai ],
    licenseKey: "NyGW6uZIY1jj_uwhXB0SXzgEG5qdECCl3lpwyHmHRQXgvqyJzMHU6lHdYGeJWz-eqNewGpqJmYjKOAffsVcDkJiK0r3Ci9M10q2b-bwPUY2EjrVZrSJMuRdTDnuQAWOk5SrHEgNygi4iABvObbJMZMIpwgM5Ve00___HzvwWXeDbmJ3OaPXsEkuAymYCT07uSwaUX8105VBJ3DwOJXZIfsmO3Lro4OazGPaX8zxY-UJ0DX8YAHd4vME_HwjhGKivLvOOyKvtLMz7KkDzh-qBfcWRkNFXtNz-Z6VHQhEjkhCuroStRI5MiVtS3k4cWhX4HwLWmLmoQ0Li7r51drd_W5cZvMmYtebXWhFanxVhEaE2UTG3or5hDYeUL1tdrf31Q4gZoKTZ1eC6jUH_TuyNHrCQbPcrysnbYVegbLzSaXOAORSig5BKMScKPhqVkkb96Tm0CXggokd4vfkEROnnQcYP6J4BuX9Ga7pXCh9V0WNhUwHTeTU55JhTtnmMXRctS-Na11NPAxj3NP2tBoQLvjG-mPIIqRrSt-2L_W1iOizLXjMRFSMBQYHOeKuYfRXqTuxJ7QhmUpP380pVgPnl9CMqURVvDkS3OHRol-YMciwMq3loN8R5VdrP5kPkHqR8",
  })
    .then(async (instance) => {
      window.instance = instance;
    })
    .catch((error) => {
      console.error(error.message);
    });
}

runner("./assets/Tofu 2.pdf");
