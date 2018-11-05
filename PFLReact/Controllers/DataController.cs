using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.IO;
using System.Diagnostics;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Cors;

namespace PFLReact.Controllers
{
    [Route("api/[controller]")]
    public class DataController : Controller
    {
        // getting the api access information from the configuration file
        private readonly IConfiguration _configuration;
        private string PFL_API_KEY;
        private string PFL_API_URL;
        private string PFL_USERNAME;
        private string PFL_PASSWORD;

        // sets the api access information
        public DataController(IConfiguration Configuration)
        {
            _configuration = Configuration;
            PFL_API_URL = "https://testapi.pfl.com/";
            PFL_API_KEY = _configuration["PFL_API:api_key"];
            PFL_USERNAME = _configuration["PFL_API:username"];
            PFL_PASSWORD = _configuration["PFL_API:password"];
        }

        public enum httpVerb
        {
            GET,
            POST
        }
        
        // makes our get/post requests to the API which returns product/order information    
        public string makeRequest(httpVerb httpMethod, string endPoint, string body = null)
        {
            string strResponseValue = string.Empty;
            System.Uri uri = new System.Uri(PFL_API_URL + endPoint + "?apikey=" + PFL_API_KEY);
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);

            NetworkCredential myNetworkCredential = new NetworkCredential(PFL_USERNAME, PFL_PASSWORD);

            CredentialCache myCredentialCache = new CredentialCache();
            myCredentialCache.Add(uri, "Basic", myNetworkCredential);

            request.ContentType = "application/json; charset=utf-8";
            request.PreAuthenticate = true;
            request.Credentials = myCredentialCache;

            request.Method = httpMethod.ToString();
            if (request.Method == "GET")
            {
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    if (response.StatusCode != HttpStatusCode.OK)
                    {
                        throw new ApplicationException("There was an error connecting to the API");
                    }

                    // Process the response stream
                    using (Stream responseStream = response.GetResponseStream())
                    {
                        if (responseStream != null)
                        {
                            using (StreamReader reader = new StreamReader(responseStream))
                            {
                                strResponseValue = reader.ReadToEnd();
                            }
                            // End of Stream Reader
                        }
                    }
                    // ENd of using Response Stream
                }
            } else {
                using (var response = new StreamWriter(request.GetRequestStream()))
                {
                    response.Write(body);
                    response.Flush();
                    response.Close();

                    var httpResponse = (HttpWebResponse)request.GetResponse();
                    using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                    {
                        strResponseValue = streamReader.ReadToEnd();
                    }
                }
            }
            
            return strResponseValue;
        }

        // called by the Data/ProductList endpoint which calls the API to return the product list to the user
        [HttpGet("[action]")]
        public IEnumerable<Product> ProductList()
        {
            
            string strResponse = string.Empty;
            strResponse = makeRequest(httpVerb.GET,"products");
            var resource = JsonConvert.DeserializeObject<dynamic>(strResponse);

            List <Product> productList = new List<Product>();

            foreach (dynamic product in resource.results.data)
            {
                Product Product = new Product
                {
                    id = product.id,
                    productID = product.productID,
                    name = product.name,
                    description = product.description,
                    imageURL = product.imageURL
                };
                productList.Add(Product);
            }
            return productList;
        }


        // called by the Data/Product endpoint which calls the api to return details of a specific product
        [HttpGet("[action]/{id:int}")]
        public Product Product(int id)
        {
            string strResponse = string.Empty;
            strResponse = makeRequest(httpVerb.GET, "products/" + id.ToString());
            var resource = JsonConvert.DeserializeObject<dynamic>(strResponse);
            dynamic product = resource.results.data;

            Product Product = new Product
            {
                id = product.id,
                name = product.name,
                description = product.description,
                imageURL = product.imageURL,
                images = product.images,
                quantityDefault = product.quantityDefault,
                quantityMinimum = product.quantityMinimum,
                quantityMaximum = product.quantityMaximum,
                quantityIncrement = product.quantityIncrement,
                hasTemplate = product.hasTemplate,
                emailTemplateId = product.emailTemplateId,
                templateFields = product.templateFields,
                deliveredPrices = product.deliveredPrices
            };
            
            return Product;
        }

        [HttpPost("[action]")]
        [Route("post")]
        public string Price()
        {
            using (var reader = new StreamReader(Request.Body))
            {
                var body = reader.ReadToEnd();
                string priceReponse = string.Empty;
                priceReponse = makeRequest(httpVerb.POST, "price", body);
                var priceResource = JsonConvert.DeserializeObject<dynamic>(priceReponse);
                dynamic orderBody = JsonConvert.SerializeObject(priceResource.results.data);

                return orderBody;

                //string orderBody = string.Empty;
                //orderResponse = makeRequest(httpVerb.POST, "orders", orderBody);
                //var orderResource = JsonConvert.DeserializeObject<dynamic>(orderResponse);
                //dynamic returnData = JsonConvert.SerializeObject(orderResource.results.data);

                //return returnData;
            }

        }

        [HttpPost("[action]")]
        [Route("post")]
        public string Purchase()
        {
            using (var reader = new StreamReader(Request.Body))
            {
                var body = reader.ReadToEnd();
                //string priceReponse = string.Empty;
                //priceReponse = makeRequest(httpVerb.POST, "price", body);
                //var priceResource = JsonConvert.DeserializeObject<dynamic>(priceReponse);
                //dynamic orderBody = JsonConvert.SerializeObject(priceResource.results.data);

                string orderResponse = string.Empty;
                orderResponse = makeRequest(httpVerb.POST, "orders", body);
                var orderResource = JsonConvert.DeserializeObject<dynamic>(orderResponse);
                dynamic returnData = JsonConvert.SerializeObject(orderResource.results.data);
                // Do something
                return returnData;
            }
            
        }
    }
}
