let renderedForPageIndex = [];

// Function to remove "px" and convert pixels to PDF points
function pixelsToPoints(pixelValue, dpi = 96) {
  const numericValue = parseFloat(pixelValue.replace("px", ""));
  // return (numericValue / dpi) * 72;
  return numericValue
}

export async function createRect(
  PSPDFKit,
  instance,
  element,
  pageIndex,
  strokeWidth = 0.5
) {
  const annotation = new PSPDFKit.Annotations.RectangleAnnotation({
    pageIndex,
    // boundingBox: new PSPDFKit.Geometry.Rect({
    //   left: element.boundingBox.left-1,
    //   top: element.boundingBox.top-1,
    //   width: element.boundingBox.width+2,
    //   height: element.boundingBox.height+2,
    // }),
    boundingBox: new PSPDFKit.Geometry.Rect({
      left: pixelsToPoints(element.left),
      top: pixelsToPoints(element.top),
      width: pixelsToPoints(element.width),
      height: pixelsToPoints(element.height),
    }),
    strokeWidth,
  });
  return await instance.create(annotation);
}

export async function mapLinesForEachPage(PSPDFKit, instance) {
  const pages = instance.totalPageCount;
  for (let index = 0; index < pages; index++) {
    // const lines = await instance.textLinesForPageIndex(index);
    const lines = window.textBlocks;

    lines.forEach(async (element) => {
      await createRect(PSPDFKit, instance, element, index);
    });
  }
}

export async function createRectsWhenScrolled(PSPDFKit, instance, index) {
  if (!renderedForPageIndex.includes(index)) {
    // const lines = await instance.textLinesForPageIndex(index);
    const lines = window.textBlocks[index];
    await lines.forEach(async (element) => {
      await createRect(PSPDFKit, instance, element, index, 1);
    });
    renderedForPageIndex.push(index);
    console.log(`Rendered for pageIndex ${index}`);
  }
}
