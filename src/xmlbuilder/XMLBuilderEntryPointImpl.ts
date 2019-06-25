import {
  BuilderOptions, XMLBuilderEntryPoint, ExpandObject,
  AttributesObject, XMLBuilder, BuilderOptionsParams, Validator, DTDOptions
} from "./interfaces"
import { DOMImplementationInstance, DOMParser, MimeType } from "../dom"
import { ValidatorImpl } from "./util"
import { applyDefaults } from "../util"
import { XMLDocument } from "../dom/interfaces"

/**
 * Serves as an entry point to builder functions.
 */
export class XMLBuilderEntryPointImpl implements XMLBuilderEntryPoint {

  private _options: BuilderOptions
  private _docType?: DTDOptions
  private _validate: Validator

  /** 
   * Initializes a new instance of  `XMLBuilderEntryPointImpl`
  */
  constructor(options?: BuilderOptionsParams) {
    options = options || {}

    this._validate = new ValidatorImpl(options.version || "1.0",
      options.validate || {})

    this._docType = options.docType

    this._options = applyDefaults(options, <BuilderOptions>{
      version: "1.0",
      inheritNS: false,
      keepNullNodes: false,
      keepNullAttributes: false,
      ignoreConverters: false,
      convert: {
        att: "@",
        ins: "?",
        text: "#",
        cdata: "$",
        comment: "!"
      }
    })

    if (this._options.convert.att.length === 0 ||
      this._options.convert.ins.length === 0 ||
      this._options.convert.text.length === 0 ||
      this._options.convert.cdata.length === 0 ||
      this._options.convert.comment.length === 0) {
      throw new Error("JS object converter strings cannot be zero length.")
    }
  }

  /** @inheritdoc */
  create(name?: string | ExpandObject, attributes?: AttributesObject | string,
    text?: AttributesObject | string): XMLBuilder {

    let builder = <XMLBuilder><unknown>this._createEmptyDocument()
    this._setOptions(builder)

    // document element node
    if (name !== undefined) {
      builder = builder.ele(name, attributes, text)
    }

    // DocType node
    if (this._docType !== undefined) {
      builder.dtd(this._docType)
    }

    return builder
  }

  /** @inheritdoc */
  fragment(): XMLBuilder {
    const doc = this._createEmptyDocument()
    this._setOptions(doc)
    return <XMLBuilder><unknown>doc.createDocumentFragment()
  }

  /** @inheritdoc */
  parse(document: string): XMLBuilder {
    const parser = new DOMParser()
    const builder = <XMLBuilder><unknown>parser.parseFromString(document, MimeType.XML)
    this._setOptions(builder)
    return builder.root()
  }

  /**
   * Creates an XML document without any child nodes.
   */
  private _createEmptyDocument(): XMLDocument {
    const doc = DOMImplementationInstance.createDocument(null, 'root')
    if (doc.documentElement) {
      doc.removeChild(doc.documentElement)
    }
    return doc
  }

  /**
   * Sets builder options.
   * 
   * @param doc - document node
   */
  private _setOptions(doc: any): void {
    doc._validate = this._validate
    doc._options = this._options
  }
}