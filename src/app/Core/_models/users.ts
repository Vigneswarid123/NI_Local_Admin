// tslint:disable-next-line: class-name
export class usersModel {
  constructor(
    public User_Id: number,
    public User_Firstname: any,
    public User_Lastname: any,
    public User_Phone: number,
    public User_Email: any,
    public User_Address: any,
    public User_Mapaddresslink: any,
    public Password: any,
    public User_Profileimage: any,
    public User_Roleid: number,
    public User_IsAdmin: any,
    public User_Type: any,
    public User_Status: any,
    public User_Created_Userid: any,
    public User_Updated_Userid: any
  ) { }
}
export class dealerusersPwdModel {
  constructor(
    public Dealer_Id: number,
    public Old_pswrd: any,
    public New_pswrd: any,

  ) { }
}

export class usersPwdModel {
  constructor(
    public User_Id: number,
    public Old_pswrd: any,
    public New_pswrd: any,

  ) { }
}