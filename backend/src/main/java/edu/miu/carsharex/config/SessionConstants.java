package edu.miu.carsharex.config;

/**
 * Session attribute keys used to track logged-in users across requests.
 * Simple session-based login (no Spring Security) for beginner-friendly demo.
 */
public final class SessionConstants {

    public static final String CUSTOMER_ID = "customerId";
    public static final String SUPPLIER_ID = "supplierId";
    public static final String ADMIN_ID = "adminId";

    private SessionConstants() {
    }
}
