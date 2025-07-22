declare module 'pdf-parse' {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
    text: string;
  }

  function pdfParse(
    dataBuffer: Buffer,
    options?: { pagerender?: (pageData: any) => string }
  ): Promise<PDFData>;

  export = pdfParse;
}
