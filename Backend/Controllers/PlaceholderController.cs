using Dekiru.Hermes;
using HomeHelper.Data;
using HomeHelper.DTO;
using Dekiru.ApiUtils.ErrorHandling;
using Microsoft.AspNetCore.Mvc;

namespace HomeHelper.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PlaceholderController(IDispatcher dispatcher) : ControllerBase
{
    [HttpGet]
    public ActionResult<string> GetHelloWorld()
    {
        return Ok("Hello, World!");
    }

    [HttpPost]
    public async Task<ActionResult<Placeholder>> CreatePlaceholder(PlaceholderCreate request)
    {
        return await dispatcher.Dispatch(request);
    }

    [HttpGet("throw-problem-details")]
    public ActionResult<string> ThrowNewProblemDetails()
    {
        throw new ProblemDetailsException(System.Net.HttpStatusCode.InternalServerError, "Hardcoded error message");
    }
}
