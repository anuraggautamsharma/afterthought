import { protectedResourceHandler, metadataCorsOptionsRequestHandler } from 'mcp-handler'

/**
 * RFC 9728 Protected Resource Metadata for the MCP server. Reached via a rewrite
 * from /.well-known/oauth-protected-resource. Points Claude at WorkOS AuthKit as
 * the authorization server, and declares this server's resource identifier.
 */
const handler = protectedResourceHandler({
  authServerUrls: [process.env.WORKOS_AUTHKIT_DOMAIN || ''],
  resourceUrl: 'https://afterthought.design/api/mcp',
})

const optionsHandler = metadataCorsOptionsRequestHandler()

export { handler as GET, optionsHandler as OPTIONS }
