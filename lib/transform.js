import recast from 'recast'
import typescriptParser from 'recast/parsers/typescript.js'

export function transform (code, { typescript = false } = {}) {
  const parserOptions = {}

  if (typescript) {
    parserOptions.parser = typescriptParser
  }
  const ast = recast.parse(code, parserOptions)
  const asserts = recast.types.namedTypes
  const builder = recast.types.builders

  let tapImportIdentifier = 't'
  let firstDescribeReplaced = false

  recast.visit(ast, {
    visitImportDeclaration (path) {
      if (
        !(
          path.node.source.value === 'tap' &&
          asserts.ImportDefaultSpecifier.check(path.node.specifiers[0])
        )
      ) {
        return false
      }

      const specifier = path.node.specifiers[0]
      if (specifier && specifier.local) {
        tapImportIdentifier = specifier.local.name
      }
      return false
    },
    visitCallExpression (path) {
      if (
        !(
          asserts.Identifier.check(path.node.callee) &&
          ['describe', 'it'].includes(path.node.callee.name)
        )
      ) {
        return false
      }

      if (path.node.callee.name === 'describe' && !firstDescribeReplaced) {
        firstDescribeReplaced = true
        path.node.callee = builder.memberExpression(
          builder.identifier(tapImportIdentifier),
          builder.identifier('test')
        )
      } else {
        path.node.callee = builder.memberExpression(
          builder.identifier('t'),
          builder.identifier('test')
        )
      }

      // If there are no args, basically the test is empty and so nothing needs
      // to be changed for it
      if (path.node.arguments.length === 0) return false

      const testBlock = path.node.arguments[1]
      if (asserts.ArrowFunctionExpression.check(testBlock)) {
        path.node.arguments[1].async = true
        path.node.arguments[1].params = [builder.identifier('t')]
      }

      this.traverse(path)
    }
  })

  recast.visit(ast, {
    visitIdentifier (path) {
      if (path.node.name !== tapImportIdentifier) return false
      if (
        asserts.MemberExpression.check(path.parent.value) &&
        path.parentPath.parent.value.callee === path.parent.value
      ) {
        path.node.name = 't'
      }

      return false
    }
  })

  return recast.prettyPrint(ast).code
}
