const http = require('http');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    try {
        console.log('--- Testing Health Check ---');
        const health = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/health',
            method: 'GET',
        });
        console.log('Health:', health);

        console.log('\n--- Testing Signup ---');
        const signupData = {
            email: `test${Date.now()}@example.com`, // Unique email
            password: 'password123',
            name: 'Test User'
        };
        const signup = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/auth/signup',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, signupData);
        console.log('Signup:', signup);

        if (!signup.body.success) {
            console.error('Signup failed, aborting.');
            return;
        }

        console.log('\n--- Testing Login ---');
        const loginData = {
            email: signupData.email,
            password: 'password123'
        };
        const login = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, loginData);
        console.log('Login:', login);

        if (!login.body.token) {
            console.error('Login failed (no token), aborting.');
            return;
        }

        console.log('\n--- Testing Verify Token ---');
        const verify = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/auth/verify',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { token: login.body.token });
        console.log('Verify:', verify);

    } catch (err) {
        console.error('Test failed:', err);
    }
}

runTests();
