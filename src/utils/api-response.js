export const successResponse = (data) => {
  return {
    success: true,
    data,
    error: null,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
};

export const errorResponse = (code, message) => {
  return {
    success: false,
    data: null,
    error: {
      code,
      message,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
};
