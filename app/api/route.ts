export async function GETLiked() {
  const res = await fetch('https://hufyvhlacb.execute-api.us-west-2.amazonaws.com/movies-liked', {
    headers: {
      'Content-Type': 'application/json'
    },
  })
  
  const data = await res.json()
 
  return data.Items
}