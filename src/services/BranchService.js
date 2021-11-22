export const phpToJsBranch = (branch) => {
  return {
    callGroupId: branch["call_group_id"],
    codecId: branch.codecs.map((item) => { return item.id }),
    pickupGroupId: branch.pickup_groups.map((item) => { return item.id }),
    password_blocked: branch.branch_users.password_blocked,
    number: branch.number,
    nat: branch.nat.id,
    port: branch.port,
    callLimit: branch["call_limit"],
    routeGroupId: branch["route_group_id"],
    dtmf: branch.dtmf.id,
    qualify: branch.qualify ? true : false,
    name: branch.branch_users.name,
    email: branch.branch_users.email,
    password: "",
    secret: "",
    externalNumber: branch.external_number ? branch.external_number : "",
  }
}

export const branch = {
  pabxId: "",
  callGroupId: "",
  codecId: [1, 2, 3],
  pickupGroupId: [],
  number: "",
  nat: 4,
  port: "5060",
  callLimit: "1",
  routeGroupId: "",
  dtmf: 1,
  qualify: true,
  name: "",
  email: "",
  password: "",
  secret: "",
  password_blocked: "",
  externalNumber: "",
  validate: {
    name: {
      message: "",
      isInvalid: false
    },
    password_blocked: {
      message: "",
      isInvalid: false
    },
    nat: {
      message: "",
      isInvalid: false
    },
    routeGroupId: {
      message: "",
      isInvalid: false
    },
    number: {
      message: "",
      isInvalid: false
    },
    port: {
      message: "",
      isInvalid: false
    },
    callLimit: {
      message: "",
      isInvalid: false
    },
    dtmf: {
      message: "",
      isInvalid: false
    },
    codecId: {
      message: "",
      isInvalid: false
    },
    callGroupId: {
      message: "",
      isInvalid: false
    },
    pickupGroupId: {
      message: "",
      isInvalid: false
    },
    email: {
      message: "",
      isInvalid: false
    },
    password: {
      message: "",
      isInvalid: false
    },
    secret: {
      message: "",
      isInvalid: false
    },
    externalNumber: {
      message: "",
      isInvalid: false
    },
    pabxId: {
      message: "",
      isInvalid: false
    },
    natId: {
      message: "",
      isInvalid: false
    },
    qualify: {
      message: "",
      isInvalid: false
    }
  },
}