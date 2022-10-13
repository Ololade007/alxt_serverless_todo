import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify} from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJG1uFGzGk4GwaMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1wbGlib2oxei51cy5hdXRoMC5jb20wHhcNMjIxMDAyMjEyNzQ0WhcN
MzYwNjEwMjEyNzQ0WjAkMSIwIAYDVQQDExlkZXYtcGxpYm9qMXoudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1djevpe0ETypzIem
wOGMGqdhlBe+N5aWgf/EgxActJL4X/6an9Jhaz3to4PAb6XqxZ6tycS1OAvtyyXp
9quHftZMTt9WhrHSsyqfojYEurlg1r/8NKmVa/9Wy2KBW/+sjh37jysqRtRwGHA0
dcfMbBGnSyvtsGrCBJnJA+j52g6Pijd8Zt5f2ys+7whNeM/o3ej6SVpwLEgH9MKs
NFipu61t4rKtj9opWc7agYniSW1T8XYv0qDhkh8lNVvADtM0dXuFlKuWCkCprlEE
RfsgENbbuodgxfTuFsCeaaqw49DwcNvCnzTBoA5s8ZbyYf9UCsaOkXxTFXsJ3faO
38IKjQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRoGW72Gxi5
UqtBcmIB2EcgJTa1FjAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AHcYl1qIz5TV5PviaiyYSCQtcFcuGrrYA/+KCSnOg2hjHiJT7eoj+ilYTOKJ7hNN
OBLT+mhvgRQQ6z+WeB+N4FSQHqKN2WehfU4rrchoIVJ7OpzxznM9CjOig2pO49Y0
hYJ+6uviNgUc8H8/ZXMlk774w0Q6ONjAzrJnSaPHZzGu52OysKM1PHuGS3YTDWSL
3fC3hAuOYn0mBohM+M48NynqnQ9I2vsC8lFWaPTMw+//DiE950a082cxSUOKi4Ua
c79b3updYGD2owzjNUjXFXp2IzqWEPqEC9yg6RXAGFvxLryV0HlHZ7NQLdcWH/64
rqhTZizx78jSgsYq10JILM0=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
  
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
