const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, nickname
     */
    const {email, password, nickname} = req.body;

    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 기타 등등 - 추가하기


    const signUpResponse = await userService.createUser(
        email,
        password,
        nickname
    );

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    // TODO: email, password 형식적 Validation
    ////내가
    //이메일 빈값체크
    if (!email)
        return res.send(response(baseResponse.USER_USEREMAIL_EMPTY));
    // 비밀번호 빈 값 체크
    if(!password)
        return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));
    //이메일 형식체크
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
    
    /////내가
    const signInResponse = await userService.postSignIn(email, password);

    return res.sendFile(__dirname + "/loginafter.html");
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId 일치하는지 확인

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};

/**
 * API No. 6
 * API Name : 회원 탈퇴(status바꾸기) API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 */

exports.patchUserStatus = async function (req, res) {

    // jwt - userId, path variable :userId 일치하는지 확인

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;


    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const userByUserId = await userProvider.retrieveUser(userId);
        if (userByUserId.status === "DELETED"){
            return res.send(errResponse({"message" : "이미 삭제된 계정입니다."}));//이미 삭제된 계정이면 삭제된 계정이라고 에러메세지
        }
        const editUserInfo = await userService.deleteUserStatus(userId)
        return res.send(editUserInfo);
    }
};

/**
 * API No. 7
 * API Name : 회원 탈퇴 API + JWT + Validation
 * [DELETE] /app/users/:userId
 * path variable : userId
 */

exports.resign = async function(req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
 
        const deleteUserInfo = await userService.deleteUser(userId);
        return res.send(deleteUserInfo);
    }

}




/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

/**
 * API No. 14
 * API Name : 모든 포인트 조회 + 좋아요 갯수 반환
 * [GET] /app/points
 */
exports.getPoints = async function(req, res) {
    const pointListResult = await userProvider.retrievePointList();
    return res.send(response(baseResponse.SUCCESS, pointListResult));
}