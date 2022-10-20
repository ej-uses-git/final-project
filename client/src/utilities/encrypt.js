const _characters =
  "v&2%wRpFdALuNehrE$5Xb1DGS/YcaVy*6kl\\o#0tOPQBC)mj984sHIx(U7qT@Jin_!zKWMZg^3f";
function encryptPassword(password) {
  const key = Math.floor(Math.random() * 30 + 1);
  let encrypted = password
    .split("")
    .map(
      char =>
        _characters[(_characters.indexOf(char) + key) % _characters.length]
    )
    .join("");
  const arrOfRandom = Array(5)
    .fill(0)
    .map(_ => _characters[Math.floor(Math.random() * _characters.length)]);

  for (let i = 0; i < 3; i++) {
    encrypted += arrOfRandom[i];
  }

  encrypted += key.toString()[0];

  encrypted += arrOfRandom[3];

  encrypted += key.toString()[1] || "";

  encrypted += arrOfRandom[4];

  return encrypted;
}

export { encryptPassword };
