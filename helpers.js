let renderedForPageIndex = [];
export async function createRect(
  PSPDFKit,
  instance,
  element,
  pageIndex,
  strokeWidth = 0.5
) {
  const annotation = new PSPDFKit.Annotations.RectangleAnnotation({
    pageIndex,
    boundingBox: new PSPDFKit.Geometry.Rect({
      left: element.boundingBox.left-1,
      top: element.boundingBox.top-1,
      width: element.boundingBox.width+2,
      height: element.boundingBox.height+2,
    }),
    strokeWidth,
  });
  return await instance.create(annotation);
}

export async function mapLinesForEachPage(PSPDFKit, instance) {
  const pages = instance.totalPageCount;
  for (let index = 0; index < pages; index++) {
    const lines = await instance.textLinesForPageIndex(index);
    lines.forEach(async (element) => {
      await createRect(PSPDFKit, instance, element, index);
    });
  }
}

export async function createRectsWhenScrolled(PSPDFKit, instance, index) {
  if (!renderedForPageIndex.includes(index)) {
    const lines = await instance.textLinesForPageIndex(index);
    await lines.forEach(async (element) => {
      await createRect(PSPDFKit, instance, element, index, 1);
    });
    renderedForPageIndex.push(index);
    console.log(`Rendered for pageIndex ${index}`);
  }
}
