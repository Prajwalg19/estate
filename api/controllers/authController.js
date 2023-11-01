export const Signin = (req, res, error) => {
    res.json({ name: "Signin" });
};

export const Signup = (req, res, error) => {
    const { userName, email, password } = req.body;
    res.send("boo");
};
