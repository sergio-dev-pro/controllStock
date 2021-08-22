export const formatUserData = (data) => ({
  isAdmin: data.IsAdmin === "True" ? true : false,
  userId: data.UserId,
  userName: data.UserName,
  branches: JSON.parse(data.Branchs),
  currentBranche: JSON.parse(data.Branchs)[0],
  exp: data.exp,
  iat: data.iat,
  nbf: data.nbf,
});
