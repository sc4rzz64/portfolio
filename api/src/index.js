const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
};

export default {
	async fetch(request, env) {
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: CORS_HEADERS });
		}

		const url = new URL(request.url);

		if (url.pathname === '/api/gallery' && request.method === 'GET') {
			const res = await fetch(
				`https://api.github.com/repos/${env.GITHUB_REPO}/contents/${env.GALLERY_PATH}`,
				{ headers: { Authorization: `token ${env.GITHUB_TOKEN}`, 'User-Agent': 'sc4rzz-worker' } }
			);
			const data = await res.json();
			return new Response(JSON.stringify(data), {
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
			});
		}

		if (url.pathname === '/api/auth' && request.method === 'POST') {
			const pwd = request.headers.get('X-Admin-Password');
			if (pwd !== env.ADMIN_PASSWORD) {
				return new Response('Unauthorized', { status: 401, headers: CORS_HEADERS });
			}
			return new Response('OK', { status: 200, headers: CORS_HEADERS });
		}

		const adminPassword = request.headers.get('X-Admin-Password');
		if (adminPassword !== env.ADMIN_PASSWORD) {
			return new Response('Unauthorized', { status: 401, headers: CORS_HEADERS });
		}

		if (url.pathname === '/api/upload' && request.method === 'POST') {
			const body = await request.json();
			const res = await fetch(
				`https://api.github.com/repos/${env.GITHUB_REPO}/contents/${env.GALLERY_PATH}/${body.filename}`,
				{
					method: 'PUT',
					headers: {
						Authorization: `token ${env.GITHUB_TOKEN}`,
						'Content-Type': 'application/json',
						'User-Agent': 'sc4rzz-worker'
					},
					body: JSON.stringify({ message: `upload ${body.filename}`, content: body.content })
				}
			);
			const data = await res.json();
			return new Response(JSON.stringify(data), {
				status: res.status,
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
			});
		}

		if (url.pathname === '/api/delete' && request.method === 'DELETE') {
			const body = await request.json();
			const res = await fetch(
				`https://api.github.com/repos/${env.GITHUB_REPO}/contents/${body.path}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `token ${env.GITHUB_TOKEN}`,
						'Content-Type': 'application/json',
						'User-Agent': 'sc4rzz-worker'
					},
					body: JSON.stringify({ message: `delete ${body.name}`, sha: body.sha })
				}
			);
			return new Response(null, {
				status: res.status,
				headers: CORS_HEADERS
			});
		}

		return new Response('Not found', { status: 404, headers: CORS_HEADERS });
	}
};
