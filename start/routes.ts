/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return { hello: "world" };
});

Route.group(() => {
  Route.get("/:stuffId", "StuffsController.find");
  Route.get("/", "StuffsController.all");
  Route.post("/", "StuffsController.create").middleware("auth");
  Route.put("/:stuffId", "StuffsController.update").middleware("auth");
  Route.delete("/:stuffId", "StuffsController.remove").middleware("auth");
}).prefix("stuffs");

Route.group(() => {
  Route.get("/", "PeriodsController.all");
  Route.get("/:periodId", "PeriodsController.find");
  Route.post("/", "PeriodsController.create").middleware("auth");
  Route.put("/:periodId", "PeriodsController.update").middleware("auth");
}).prefix("periods");

Route.group(() => {
  Route.get("/", "ClocksController.all");
  Route.get("/:clockId", "ClocksController.find");
  Route.post("/", "ClocksController.create").middleware("auth");
  Route.put("/:clockId", "ClocksController.update").middleware("auth");
}).prefix("clocks");

Route.group(() => {
  Route.get("/", "AccountTypesController.index");
  Route.post("/", "AccountTypesController.create");
})
  .prefix("accounttypes")
  .middleware("auth");

Route.group(() => {
  Route.get("/", "StatusesController.index");
  Route.post("/", "StatusesController.create");
})
  .prefix("statuses")
  .middleware("auth");

Route.group(() => {
  Route.group(() => {
    Route.post("/customer", "AuthController.loginCustomer");
    Route.post("/provider", "AuthController.loginProvider");
    Route.post("/admin", "AuthController.loginAdmin");
  }).prefix("/login");

  Route.group(() => {
    Route.post("/provider", "AuthController.registerProvider");
    Route.post("/customer", "AuthController.registerCustomer");
    Route.post("/admin", "AuthController.registerAdmin");
    Route.get("/verifyemail/:verificationCode", "AuthController.verifyEmail");
  }).prefix("/register");
}).prefix("auth");

Route.group(() => {
  Route.get("/", "AddressesController.index");
  Route.get("/:id", "AddressesController.find");
})
  .prefix("addresses")
  .middleware("auth");

Route.group(() => {
  Route.get("/", "ProvidersController.index");
  Route.get("/:id", "ProvidersController.index");
  Route.put("/changeAccountType", "ProvidersController.changeAccountType");
  Route.put("/:id", "ProvidersController.update");
  Route.get("/profile", "ProvidersController.profile");
})
  .prefix("providers")
  .middleware("auth");

Route.group(() => {
  Route.get("/", "CustomersController.index");
  Route.get("/findById/:id", "CustomersController.findById");
  Route.get("/findByToken/:token", "CustomersController.findByToken");
  Route.put("/:id", "CustomersController.update");
})
  .prefix("customers")
  .middleware("auth");

Route.group(() => {
  Route.put(
    "/updatePictureProfile/:id",
    "CustomersController.updatePictureProfile"
  );
}).prefix("customers");

Route.group(() => {
  Route.get("/registrations", "ChartsController.registrations");
  Route.get("/appointments", "ChartsController.appointments");
  Route.get("/total-registrations", "ChartsController.totalRegistrations");
})
  .prefix("charts")
  .middleware("auth");

Route.group(() => {
  Route.get("/", "AdminsController.index");
  Route.get("/:adminId", "AdminsController.find");
})
  .prefix("admin")
  .middleware("auth");

Route.group(() => {
  Route.get("/", "ServicesController.all");
  Route.get("/:serviceId", "ServicesController.find");
  Route.post("/", "ServicesController.create").middleware("auth");
  Route.put("/:serviceId", "ServicesController.update").middleware("auth");
  Route.delete("/:serviceId", "ServicesController.remove").middleware("auth");
}).prefix("services");

Route.group(() => {
  Route.get("/", "RatingsController.index");
  Route.get("/find", "RatingsController.find");
  Route.post("/", "RatingsController.create").middleware("auth");
}).prefix("ratings");

Route.group(() => {
  Route.get("/:providerId", "ProviderServicesController.find");
  Route.get("/", "ProviderServicesController.all");
  Route.post("/", "ProviderServicesController.create");
  Route.put("/:providerServiceId", "ProviderServicesController.update");
})
  .prefix("providerservices")
  .middleware("auth");

Route.group(() => {
  Route.get("/", "AppointmentsController.all");
  Route.get("/filter", "AppointmentsController.filter");
  Route.get("/:appointmentId", "AppointmentsController.find");
  Route.put(
    "/:appointmentId/updatestatus",
    "AppointmentsController.updateStatus"
  );
  Route.get("/provider/requests", "AppointmentsController.requests");
  Route.post("/", "AppointmentsController.create");
  Route.put("/:id", "AppointmentsController.update");
})
  .prefix("appointments")
  .middleware("auth");

Route.group(() => {
  Route.get("/", "ProviderStuffsController.all");
  Route.post("/", "ProviderStuffsController.create");
  Route.get("/:providerId", "ProviderStuffsController.find");
  Route.put("/:providerStuffId", "ProviderStuffsController.update");
  Route.put("/provider/:providerId", "ProviderStuffsController.updateStuffProvider");
})
  .prefix("providerstuffs")
  .middleware("auth");

Route.group(() => {
  Route.get("/", "ChecksController.find");
}).prefix("checks");

Route.group(() => {
  Route.post("/", "UploadsController.index");
  Route.get("/:filename", "UploadsController.find");
}).prefix("uploads");

Route.group(() => {
  Route.get("/find", "PaymentController.find");
  Route.post("/createPayment", "PaymentController.create");
  Route.post("/payment-sheet", "PaymentController.paymentSheet");
  Route.get("/", "PaymentController.findHistory");
  Route.get("/request-transfer", "PaymentController.findRequestTransfer");
  Route.put("/:paymentsId", "PaymentController.update");
  Route.put("/updateAvailable/:appointmentId", "PaymentController.updateAvailable");
  Route.post("/registerhistory", "PaymentController.registerHistory");
  Route.get("/balanceprovider/:providerId", "PaymentController.balanceProvider");
  Route.post("/requestwithdraw", "PaymentController.requestWithdraw");
  Route.post("/confirmwithdraw/:providerId", "PaymentController.confirmWithdraw");
})
  .prefix("payment")
  .middleware("auth");

Route.group(() => {
  Route.post("/", "StripeAccountsController.create");
  Route.get("/find", "StripeAccountsController.find");
})
  .prefix("stripeaccounts")
  .middleware("auth");
