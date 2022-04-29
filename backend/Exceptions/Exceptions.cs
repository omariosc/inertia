namespace inertia.Exceptions;

/// <summary>
/// Thrown when a scooter is not available
/// </summary>
public class UnavailableScooterException: Exception
{
}

/// <summary>
/// Thrown when an order cannot be cancelled
/// </summary>
public class OrderApprovedOrOngoingException : Exception
{
}

/// <summary>
/// Thrown when an order cannot be extended
/// </summary>
public class OrderCannotBeExtendException : Exception
{
}


/// <summary>
/// Thrown when an account cannot be created due to the email address being already taken.
/// </summary>
public class EmailAlreadyExistsException : Exception
{
}