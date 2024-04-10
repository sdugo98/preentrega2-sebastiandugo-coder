export const currentDTO =(user)=>{
    user.first_name = user.first_name.toLowerCase()
    user.last_name = user.last_name.toUpperCase()
    return user
}