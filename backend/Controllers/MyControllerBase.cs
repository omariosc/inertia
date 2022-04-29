using inertia.Enums;
using Microsoft.AspNetCore.Mvc;

namespace inertia.Controllers;

/// <summary>
/// Customer Controller base to make returning ApplicationError easier.
/// </summary>
public class MyControllerBase : Controller
{
    protected ActionResult ApplicationError(
            ApplicationErrorCode errorCode, 
            string message,
            string? detail = null
        )
    {
        return UnprocessableEntity(new Dtos.ApplicationError(
            message,
            errorCode,
            detail
        ));
    }
}