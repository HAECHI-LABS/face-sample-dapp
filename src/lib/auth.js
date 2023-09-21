import { ethers } from 'ethers';
import forge from 'node-forge';
import qs from 'qs';

export async function customTokenLogin(
  face,
  provider,
  prvKey,
  handleLogin
) {
  let newWin;
  const redirect_url = 'https://us-central1-prj-d-face.cloudfunctions.net/externalSocialLogin';
  switch (provider) {
    case 'google.com':
      const googleQueryStr = qs.stringify({
        client_id: '478075746592-2eph96cegqojcd29r1bg62ur64d9bbql.apps.googleusercontent.com',
        redirect_uri: redirect_url,
        response_type: 'code',
        state: 'google.com',
        scope: 'openid profile email',
        nonce:
          Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      });

      newWin = await openWindow(`https://accounts.google.com/o/oauth2/v2/auth?${googleQueryStr}`);
      break;
    case 'facebook.com':
      const facebookQueryStr = qs.stringify({
        client_id: '1480475282042464',
        redirect_uri: redirect_url,
        response_type: 'code',
        display: 'popup',
        scope: 'openid',
        state: 'facebook.com',
        nonce:
          Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      });

      newWin = await openWindow(`https://www.facebook.com/v14.0/dialog/oauth?${facebookQueryStr}`);
      break;
    case 'apple.com':
      const apple_redirect_url = encodeURIComponent(
        'https://appleid.apple.com/auth/authorize?client_id=xyz.facewallet.3rd&redirect_uri=https%3A%2F%2Fus-central1-prj-d-face.cloudfunctions.net%2FexternalSocialLogin&response_type=code%20id_token&scope=name%20email&response_mode=form_post&state=apple.com'
      );
      newWin = await openWindow(
        `https://us-central1-prj-d-face.cloudfunctions.net/externalSocialLogin?redirect_uri=${apple_redirect_url}`
      );
      break;
    case 'kakao.com':
      const kakaoQueryStr = qs.stringify({
        client_id: '1d81f69a60f238d6ec4679e0fe543777',
        redirect_uri: redirect_url,
        response_type: 'code',
        scope: 'openid account_email',
        prompt: 'login',
        state: 'kakao.com',
        nonce:
          Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      });
      newWin = await openWindow(`https://kauth.kakao.com/oauth/authorize?${kakaoQueryStr}`);
      break;
    case 'twitter.com':
      const twitterQueryStr = qs.stringify({
        client_id: 'SjJaRkMzVmRuaUNGbVU0N2diRl86MTpjaQ',
        redirect_uri: redirect_url,
        response_type: 'code',
        scope: 'tweet.read users.read',
        state: 'twitter.com',
        code_challenge: 'challenge',
        code_challenge_method: 'plain',
      });
      newWin = await openWindow(`https://twitter.com/i/oauth2/authorize?${twitterQueryStr}`);
      break;
    case 'discord.com':
      const discordQueryStr = qs.stringify({
        client_id: '1118508250824982579',
        redirect_uri: redirect_url,
        response_type: 'code',
        scope: 'email identify',
        state: 'discord.com',
      });
      newWin = await openWindow(`https://discord.com/api/oauth2/authorize?${discordQueryStr}`);
      break;
    default:
        throw new Error(`Unknown provider ${provider}`)
  }
  const listener = async (e) => {
    console.log(e);
    if (e.origin !== 'https://us-central1-prj-d-face.cloudfunctions.net') {
      return;
    }

    const idToken = e.data.id_token ?? e.data.access_token;
    const signature = createSignatureForIdToken(idToken, prvKey);

    switch (provider) {
      case 'twitter.com':
      case 'discord.com':
        face?.auth
          .loginWithAccessToken({
            accessToken: idToken,
            sig: signature,
            issuer: provider,
          })
          .then(handleLogin)
          .catch((reason) => {
            console.log('Face Wallet Login Failed:', reason);
          });
        break;
      default:
        face?.auth
          .loginWithIdToken({
            idToken: idToken,
            sig: signature,
          })
          .then(handleLogin)
          .catch((reason) => {
            console.log('Face Wallet Login Failed:', reason);
          });
    }

    newWin?.close();
    window.removeEventListener('message', listener);
  };
  window.addEventListener('message', listener);
}

export async function customTokenLoginWithToken(
  face,
  provider,
  token,
  prvKey,
  handleLogin
) {
  if (provider === 'twitter.com') {
    const signature = createSignatureForIdToken(token, prvKey);
    face?.auth
      .loginWithAccessToken({
        accessToken: token,
        sig: signature,
        issuer: provider,
      })
      .then(handleLogin)
      .catch((reason) => {
        console.log('Face Wallet Login Failed:', reason);
      });
  }
}

async function openWindow(url, width = 500, height = 600) {
  const top = Math.max((window.screen.availHeight - height) / 2, 0).toString();
  const left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
  const target = '';

  const options = {
    location: 'yes',
    resizable: 'yes',
    statusbar: 'yes',
    toolbar: 'no',
    width: width.toString(),
    height: height.toString(),
    top,
    left,
  };

  const optionsString = Object.entries(options).reduce(
    (accum, [key, value]) => `${accum}${key}=${value},`,
    ''
  );

  return window.open(url || '', target, optionsString);
}

export function createPemFromApiKey(privateKey) {
  return `-----BEGIN RSA PRIVATE KEY-----\n${privateKey
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .replace(/(\S{64}(?!$))/g, '$1\n')}\n-----END RSA PRIVATE KEY-----\n`;
}

export function createSignatureForIdToken(idToken, prvKey) {
  const messageDigest = forge.md.sha256.create();
  messageDigest.update(idToken, 'utf8');
  const privateKey = forge.pki.privateKeyFromPem(createPemFromApiKey(prvKey));
  const arrayBuffer = forge.util.binary.raw.decode(privateKey.sign(messageDigest));
  return ethers.utils.base64.encode(arrayBuffer);
}
