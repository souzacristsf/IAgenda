
```
db.schedules.update(
  {"_id" : ObjectId("5b99449666a6061bf47207fe"), },
  {
    $addToSet: {
      event: {
        name: "Meu primeiro evento",
        description: "Meu unico evento",
        date_initial: new Date(),
        date_end: new Date()
      }
    }
  }
  )
```
