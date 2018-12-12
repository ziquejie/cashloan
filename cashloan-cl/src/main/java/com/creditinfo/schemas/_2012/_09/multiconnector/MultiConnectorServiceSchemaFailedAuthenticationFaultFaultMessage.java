
package com.creditinfo.schemas._2012._09.multiconnector;

import javax.xml.ws.WebFault;


/**
 * This class was generated by the JAX-WS RI.
 * JAX-WS RI 2.2.9-b130926.1035
 * Generated source version: 2.2
 * 
 */
@WebFault(name = "FailedAuthentication", targetNamespace = "http://creditinfo.com/schemas/2012/09/MultiConnector")
public class MultiConnectorServiceSchemaFailedAuthenticationFaultFaultMessage
    extends Exception
{

    /**
     * Java type that goes as soapenv:Fault detail element.
     * 
     */
    private FailedAuthentication faultInfo;

    /**
     * 
     * @param faultInfo
     * @param message
     */
    public MultiConnectorServiceSchemaFailedAuthenticationFaultFaultMessage(String message, FailedAuthentication faultInfo) {
        super(message);
        this.faultInfo = faultInfo;
    }

    /**
     * 
     * @param faultInfo
     * @param cause
     * @param message
     */
    public MultiConnectorServiceSchemaFailedAuthenticationFaultFaultMessage(String message, FailedAuthentication faultInfo, Throwable cause) {
        super(message, cause);
        this.faultInfo = faultInfo;
    }

    /**
     * 
     * @return
     *     returns fault bean: com.creditinfo.schemas._2012._09.multiconnector.FailedAuthentication
     */
    public FailedAuthentication getFaultInfo() {
        return faultInfo;
    }

}
