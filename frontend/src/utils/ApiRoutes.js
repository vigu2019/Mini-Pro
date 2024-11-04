const  host  =  'http://localhost:8080' ;
export  const  registerRoute =  `${ host }/api/auth/register` ;
export  const  loginRoute =  ` ${host}/api/auth/login` ;
export  const  packagesRoute =  ` ${host}/api/travel/packages` ;
export const logoutRoute = `${host}/api/auth/logout`;
export const eachPackageRoute = `${host}/api/travel/package`;
export const bookingRoute = `${host}/api/booking/create`;
export const viewBookingRoute = `${host}/api/booking/view`;
export const adminRoutes = {
    viewUsers: `${host}/api/admin/users`,
    deleteUser: `${host}/api/admin/users`, 
    viewBookings: `${host}/api/admin/bookings`,
    updateBooking: `${host}/api/admin/bookings`, 
    viewPackages: `${host}/api/admin/packages`,
    deletePackage: `${host}/api/admin/packages`, 
    addPackage: `${host}/api/admin/packages`
};
