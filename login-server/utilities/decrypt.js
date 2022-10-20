const _characters =
  "v&2%wRpFdALuNehrE$5Xb1DGS/YcaVy*6kl\\o#0tOPQBC)mj984sHIx(U7qT@Jin_!zKWMZg^3f";

function encryptFromKey(passwordAttempt, encryptedPass) {
  try {
    const innerSection = encryptedPass.slice(3 + passwordAttempt.length, -1);
    let innerKey;
    if (innerSection.length < 3) innerKey = innerSection[0].toString();
    else innerKey = innerSection[0].toString() + innerSection[2].toString();
    const key = parseInt(innerKey);
    let encrypted = passwordAttempt
      .split("")
      .map(
        (char) =>
          _characters[(_characters.indexOf(char) + key) % _characters.length]
      )
      .join("");

    encrypted +=
      innerSection.length >= 3
        ? encryptedPass.slice(-7)
        : encryptedPass.slice(-6);
    return encrypted === encryptedPass;
  } catch (error) {
    return false;
  }
}

module.exports = { encryptFromKey };
