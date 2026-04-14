const key1 = 'AIzaSyDm-ESeBzevPcozZgYgJr34j7Udz-Gibal'; // with l
const key2 = 'AIzaSyDm-ESeBzevPcozZgYgJr34j7Udz-GibaI'; // with I uppercase

async function testKey(key) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
  });
  console.log(`Key ending in ${key.slice(-1)} -> Status: ${res.status}`);
  if (!res.ok) {
     const data = await res.json();
     console.log('Error:', data);
  }
}

async function run() {
  await testKey(key1);
  await testKey(key2);
}
run();
