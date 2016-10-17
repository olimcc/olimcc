(defproject olimcc "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :min-lein-version "2.0.0"
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [compojure "1.4.0"]
                 [ring/ring-defaults "0.1.5"]
                 [org.clojure/java.jdbc "0.4.2"]
                 [org.clojure/tools.logging "0.3.1"]
                 [log4j/log4j "1.2.17" :exclusions [javax.mail/mail
                                                    javax.jms/jms
                                                    com.sun.jdmk/jmxtools
                                                    com.sun.jmx/jmxri]]
                 [ring.middleware.logger "0.5.0"]
                 [cheshire "5.5.0"]
                 [org.xerial/sqlite-jdbc "3.7.2"]
                 [mysql/mysql-connector-java "5.1.40"]
                 ]
  :plugins [[lein-ring "0.9.7"]]
  :ring {:init olimcc.handler/init
         :handler olimcc.handler/app
         :port 80}
  :jvm-opts ["-Xmx4g" "-server"]
  :profiles
  {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]
                        [ring/ring-mock "0.3.0"]]
         :jvm-opts ["-Dlog4j.configuration=log4j-development.properties"]
         :ring {:port 4000}}})
