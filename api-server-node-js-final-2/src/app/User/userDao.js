// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, nickname 
                FROM UserInfo 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회 // status까지 가져오는걸로 수정
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT id, email, nickname, password, status 
                 FROM UserInfo 
                 WHERE id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO UserInfo(email, password, nickname)
        VALUES (?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, nickname, password
        FROM UserInfo 
        WHERE email = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, id
        FROM UserInfo 
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}


async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
       UPDATE UserInfo 
       SET nickname = ?
       WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  return updateUserRow[0];
}

async function updateUserStatus(connection, id) {        //내가만든 회원 상태 deleted로 바꾸는 api
  const updateUserStatusQuery = `
        UPDATE UserInfo 
        SET status = ?
        WHERE id = ?;`;
  const updateUserStatusRow = await connection.query(updateUserStatusQuery, ["DELETED", id]);
  return updateUserStatusRow[0];
}

async function deleteUserIn(connection, id) {
  const deleteUserQuery = `
       DELETE
       FROM UserInfo
       WHERE id = ?;`;
  const deleteUserRow = await connection.query(deleteUserQuery, id);
  return deleteUserRow[0];
}
async function selectPoint(connection){
  const selectPointListQuery = `
  SELECT title, type, creature, date, content 
  From Points;`;
  const [pointRows] = await connection.query(selectPointListQuery);
  return pointRows;
  
}

module.exports = {
  selectPoint,
  selectUser,
  selectUserEmail,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  updateUserStatus,
  deleteUserIn
};
