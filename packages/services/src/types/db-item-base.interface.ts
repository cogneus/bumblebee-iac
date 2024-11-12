export interface DBItemPrimaryBase {
  PK: string
  SK: string
}
export interface DBItemSecondaryBase {
  PKGSI: string
  SKGSI: string
}
export interface DBItemBase extends DBItemPrimaryBase, DBItemSecondaryBase {}
