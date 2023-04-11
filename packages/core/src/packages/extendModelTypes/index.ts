export const extendModelTypes = ({
  definition,
  skipModels,
}: {
  definition: string
  skipModels?: Array<string>
}) => {
  return (mercury: MercuryTBare): void => {
    mercury.createPreHook(
      'BEFORE_CREATELIST',
      function (this: any, done: () => void) {
        if (
          skipModels &&
          skipModels?.length > 0 &&
          skipModels?.includes(this.name)
        ) {
          done()
        } else {
          this.schema['extendType'] = [
            {
              type: this.name,
              definition: definition,
            },
          ]
          done()
        }
      }
    )
  }
}
