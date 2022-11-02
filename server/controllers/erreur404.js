exports.get404 = (req, res, next) => {
    res.status(404).render("app/erreur404.ejs", {
        description: "Page introuvable, veuillez verifier l'URL dans la barre d'adresse!",
        path: "/home",
        title: "404"
    });
};