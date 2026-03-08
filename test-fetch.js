fetch("http://localhost:3000/api/blog/admin/all")
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
